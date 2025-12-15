<?php

namespace App\Services\Admin;

use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\Ruang;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Exception;

class OsceJadwalService
{
    public function getJadwalList($id_osce, $search = null)
    {
        $sesi_virtual_query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal')
            ->select('tanggal', 'jam_mulai', 'jam_selesai', DB::raw('MIN(id_osce_stase) as id_osce_stase'))
            ->groupBy('tanggal', 'jam_mulai', 'jam_selesai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc');

        if ($search) {
            $sesi_virtual_query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi_paginated = $sesi_virtual_query->paginate(10);

        // Transform data
        $sesi_paginated->getCollection()->transform(function ($sesi) use ($id_osce) {
            // 1. Hitung jumlah mahasiswa
            $sesi->jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi->tanggal)
                ->where('jam_sesi', $sesi->jam_mulai)
                ->count();

            // 2. Ambil Data Ruangan (Salah satu sebagai representasi)
            $info_ruang = DB::table('osce_stase')
                ->join('ruang', 'osce_stase.id_ruang', '=', 'ruang.id_ruang')
                ->where('id_osce', $id_osce)
                ->where('tanggal', $sesi->tanggal)
                ->where('jam_mulai', $sesi->jam_mulai)
                ->select('ruang.nomor_ruangan', 'ruang.lokasi')
                ->first();

            $sesi->nama_ruang = $info_ruang
                ? $info_ruang->nomor_ruangan . ' - ' . $info_ruang->lokasi
                : '-';

            // 3. Formatting
            $sesi->tanggal_formatted = (new \DateTime($sesi->tanggal))->format('d M Y');
            $sesi->jam_mulai_formatted = substr($sesi->jam_mulai, 0, 5);
            $sesi->jam_selesai_formatted = substr($sesi->jam_selesai, 0, 5);
            // ID unik untuk referensi frontend (gabungan tanggal & jam)
            $sesi->sesi_id = $sesi->tanggal . '_' . $sesi->jam_mulai;

            return $sesi;
        });

        return ['sesi' => $sesi_paginated];
    }

    public function getTemplates($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        // Ambil template (stase yang tanggalnya NULL)
        $templates = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal')
            ->with(['stase', 'ruang', 'penguji'])
            ->get()
            ->map(fn($item) => [
                'id_osce_stase' => $item->id_osce_stase,
                'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')',
                'detail' => $item
            ]);

        return [
            'osce' => $osce,
            'templates' => $templates
        ];
    }

    public function createSession($data, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        // 1. Validasi Rentang Tanggal
        $inputDate = Carbon::parse($data['tanggal'])->startOfDay();
        $startDate = Carbon::parse($osce->tanggal_mulai)->startOfDay();
        $endDate   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

        if ($inputDate->lessThan($startDate) || $inputDate->greaterThan($endDate)) {
            throw new Exception('Tanggal yang dipilih di luar periode pelaksanaan OSCE (' . $osce->tanggal_mulai . ' s.d ' . $osce->tanggal_selesai . ').');
        }

        // 2. Validasi Jumlah
        $jumlah_stase = count($data['stase_ids']);
        $jumlah_mahasiswa = count($data['mahasiswa_ids'] ?? []);

        // Logic optional: apakah jumlah mhs harus sama dengan stase?
        // Sesuai kode inertia Anda:
        if ($jumlah_stase !== $jumlah_mahasiswa && $jumlah_mahasiswa > 0) {
            throw new Exception("Jumlah mahasiswa ($jumlah_mahasiswa) harus sama dengan jumlah stase ($jumlah_stase).");
        }

        // 3. Hitung Waktu
        $waktu_mulai = Carbon::parse($data['jam_mulai']);
        $jam_fix = $waktu_mulai->format('H:i');
        $total_menit = (int)$data['durasi'] * $jumlah_stase; // Asumsi durasi total sesi
        // Atau jika durasi per stase, logic bisa disesuaikan
        $waktu_selesai = $waktu_mulai->copy()->addMinutes($total_menit);

        DB::beginTransaction();
        try {
            // A. SIMPAN JADWAL STASE
            // Di sini kita asumsikan stase_ids berisi ID Template yang akan di-replicate
            // Atau jika logicnya manual loop seperti di Inertia controller:

            // NOTE: Pada controller inertia Anda ada logic manual loop 'penguji_map' dll. 
            // Namun, di method 'update' Anda menggunakan replicate.
            // Untuk konsistensi dengan fitur 'getTemplates', kita asumsikan user mengirim ID Template.

            // JIKA Logicnya Replicate dari Template (seperti method Update):
            foreach ($data['stase_ids'] as $templateId) {
                $template = OsceStase::find($templateId);
                if ($template) {
                    $new = $template->replicate();
                    $new->tanggal = $data['tanggal'];
                    $new->jam_mulai = $jam_fix;
                    $new->jam_selesai = $waktu_selesai->format('H:i');
                    // Jika ada override durasi
                    if (isset($data['durasi'])) $new->durasi_per_mahasiswa = $data['durasi'];
                    $new->save();
                }
            }

            // B. SIMPAN ENROLLMENT MAHASISWA
            if (!empty($data['mahasiswa_ids'])) {
                foreach ($data['mahasiswa_ids'] as $mhsId) {
                    $alreadyBooked = EnrollmentOsce::where('id_osce', $id_osce)
                        ->where('id_mahasiswa', $mhsId)
                        ->exists();

                    if ($alreadyBooked) {
                        $mhs = Mahasiswa::find($mhsId);
                        throw new Exception("Mahasiswa {$mhs->nama} sudah memiliki jadwal di ujian ini.");
                    }

                    EnrollmentOsce::create([
                        'id_osce' => $id_osce,
                        'id_mahasiswa' => $mhsId,
                        'tanggal_sesi' => $data['tanggal'],
                        'jam_sesi' => $jam_fix
                    ]);
                }
            }

            DB::commit();
            return [
                'tanggal' => $data['tanggal'],
                'jam_mulai' => $jam_fix,
                'jam_selesai' => $waktu_selesai->format('H:i')
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getSessionDetail($id_osce, $sesi_id_or_params)
    {
        // Parsing input. Bisa berupa string "YYYY-MM-DD_HH:MM" atau array ['tanggal' => ..., 'jam' => ...]
        if (is_array($sesi_id_or_params)) {
            $tanggal = $sesi_id_or_params['tanggal'];
            $jam_mulai = $sesi_id_or_params['jam_mulai'];
        } else {
            // Jika formatnya string composite (e.g. untuk Show/Edit)
            if (strpos($sesi_id_or_params, '_') === false) return null;
            list($tanggal, $jam_mulai) = explode('_', $sesi_id_or_params);
            // Fix jam format if needed (e.g. 08:00:00 to 08:00)
            $jam_mulai = substr($jam_mulai, 0, 5);
        }

        $stase_list = OsceStase::with(['stase', 'penguji', 'ruang'])
            ->where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', 'like', $jam_mulai . '%')
            ->get()
            ->map(fn($item) => [
                'id_osce_stase' => $item->id_osce_stase,
                'stase' => $item->stase->nama_stase,
                'penguji' => $item->penguji->nama ?? '-',
                'ruang' => $item->ruang->nomor_ruangan . ' (' . $item->ruang->lokasi . ')',
                // Kembalikan ID raw untuk keperluan edit form check
                'raw_id_stase' => $item->id_stase,
                'raw_id_penguji' => $item->id_penguji,
                'raw_id_ruang' => $item->id_ruang,
            ]);

        $mahasiswa_list = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->where('tanggal_sesi', $tanggal)
            ->where('jam_sesi', 'like', $jam_mulai . '%')
            ->get()
            ->map(fn($item) => [
                'id_mahasiswa' => $item->id_mahasiswa,
                'nama' => $item->mahasiswa->nama,
                'nim' => $item->mahasiswa->nim
            ]);

        return [
            'info' => [
                'tanggal' => $tanggal,
                'jam_mulai' => $jam_mulai
            ],
            'stase_data' => $stase_list,
            'mahasiswa_data' => $mahasiswa_list
        ];
    }

    public function updateSession($data, $id_osce, $sesi_id)
    {
        list($old_tanggal, $old_jam_mulai) = explode('_', $sesi_id);
        // Clean jam format
        $old_jam_mulai = substr($old_jam_mulai, 0, 5);

        DB::beginTransaction();
        try {
            // 1. HAPUS sesi stase LAMA
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $old_tanggal)
                ->where('jam_mulai', 'like', $old_jam_mulai . '%')
                ->delete();

            // 2. Update Enrollment Mahasiswa (Pindah Jadwal)
            // Jika tanggal/jam berubah, enrollment mahasiswa juga harus diupdate
            $needs_move = ($old_tanggal != $data['tanggal']) || ($data['jam_mulai'] != $old_jam_mulai);

            if ($needs_move) {
                EnrollmentOsce::where('id_osce', $id_osce)
                    ->where('tanggal_sesi', $old_tanggal)
                    ->where('jam_sesi', 'like', $old_jam_mulai . '%')
                    ->update([
                        'tanggal_sesi' => $data['tanggal'],
                        'jam_sesi' => $data['jam_mulai']
                    ]);
            }

            // 3. Buat BARU dari template stase yang dipilih
            foreach ($data['stase_ids'] as $templateId) {
                $template = OsceStase::find($templateId);
                if ($template) {
                    $new = $template->replicate();
                    $new->tanggal = $data['tanggal'];
                    $new->jam_mulai = $data['jam_mulai'];
                    $new->jam_selesai = $data['jam_selesai'];
                    $new->save();
                }
            }

            DB::commit();
            return [
                'tanggal' => $data['tanggal'],
                'jam_mulai' => $data['jam_mulai']
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteSession($id_osce, $sesi_id)
    {
        list($tanggal, $jam_mulai) = explode('_', $sesi_id);
        $jam_mulai = substr($jam_mulai, 0, 5);

        DB::beginTransaction();
        try {
            // 1. Hapus Stase
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $tanggal)
                ->where('jam_mulai', 'like', $jam_mulai . '%')
                ->delete();

            // 2. Hapus Enrollment Mahasiswa
            EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $tanggal)
                ->where('jam_sesi', 'like', $jam_mulai . '%')
                ->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // --- Helper Methods (Availability & Mahasiswa Filter) ---

    public function checkAvailability($data)
    {
        $start = Carbon::parse($data['jam_mulai']);
        $end = $start->copy()->addMinutes((int)$data['durasi']);
        $startStr = $start->format('H:i:s');
        $endStr = $end->format('H:i:s');

        // Logic check conflict ruang & penguji
        $busyRuangIds = OsceStase::where('tanggal', $data['tanggal'])
            ->where(function ($q) use ($startStr, $endStr) {
                $q->where('jam_mulai', '<', $endStr)
                    ->where('jam_selesai', '>', $startStr);
            })
            ->pluck('id_ruang')->toArray();

        $busyPengujiIds = OsceStase::where('tanggal', $data['tanggal'])
            ->where(function ($q) use ($startStr, $endStr) {
                $q->where('jam_mulai', '<', $endStr)
                    ->where('jam_selesai', '>', $startStr);
            })
            ->pluck('id_penguji')->toArray();

        $availableRooms = Ruang::whereNotIn('id_ruang', $busyRuangIds)
            ->select('id_ruang', 'nomor_ruangan', 'lokasi')
            ->get();

        $availablePenguji = Penguji::whereNotIn('id_penguji', $busyPengujiIds)
            ->select('id_penguji', 'nama', 'nip')
            ->get();

        return [
            'rooms' => $availableRooms,
            'penguji' => $availablePenguji
        ];
    }

    public function getMahasiswaCandidates($id_osce, $angkatan = null)
    {
        $booked_ids = [];
        if ($id_osce) {
            $booked_ids = EnrollmentOsce::where('id_osce', $id_osce)
                ->pluck('id_mahasiswa')->toArray();
        }

        $query = Mahasiswa::query()->select('id_mahasiswa', 'nama', 'nim')->orderBy('nim', 'asc');

        if ($angkatan) {
            $tahun_target = substr($angkatan, 0, 4);
            $query->whereHas('enrollment.tahunAkademik', function ($q) use ($angkatan) {
                $q->where('tahun', $angkatan);
            })
                ->whereDoesntHave('enrollment.tahunAkademik', function ($q) use ($tahun_target) {
                    $q->whereRaw('CAST(SUBSTRING(tahun, 1, 4) AS UNSIGNED) < ?', [(int)$tahun_target]);
                });
        }

        $mahasiswa = $query->get()->map(fn($m) => [
            'id_mahasiswa' => $m->id_mahasiswa,
            'label' => "{$m->nim} - {$m->nama}",
            'already_enrolled' => in_array($m->id_mahasiswa, $booked_ids)
        ]);

        $list_angkatan = TahunAkademik::whereHas('enrollment')
            ->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        return [
            'mahasiswa' => $mahasiswa,
            'angkatan_options' => $list_angkatan
        ];
    }
}
