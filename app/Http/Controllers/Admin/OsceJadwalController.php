<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\OsceStase;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class OsceJadwalController extends Controller
{
    /**
     * Menampilkan daftar Sesi (Jadwal) yang sudah di-grup
     */
    public function index(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $search = $request->query('search');

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

        $sesi_paginated = $sesi_virtual_query->paginate(10)->withQueryString();

        $sesi_data = $sesi_paginated->through(function ($sesi) use ($id_osce) {
            $sesi->jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi->tanggal)
                ->where('jam_sesi', $sesi->jam_mulai)
                ->count();

            $info_ruang = DB::table('osce_stase')
                ->join('ruang', 'osce_stase.id_ruang', '=', 'ruang.id_ruang')
                ->where('id_osce', $id_osce)
                ->where('tanggal', $sesi->tanggal)
                ->where('jam_mulai', $sesi->jam_mulai)
                ->select('ruang.nomor_ruangan', 'ruang.lokasi')
                ->first();

            if ($info_ruang) {
                $sesi->nama_ruang = $info_ruang->nomor_ruangan . ' - ' . $info_ruang->lokasi;
            } else {
                $sesi->nama_ruang = '-';
            }

            $sesi->tanggal_formatted = (new \DateTime($sesi->tanggal))->format('d M Y');
            $sesi->jam_mulai_formatted = substr($sesi->jam_mulai, 0, 5);
            $sesi->jam_selesai_formatted = substr($sesi->jam_selesai, 0, 5);

            return $sesi;
        });

        $master_stase = Stase::select('id_stase', 'nama_stase')->get()->map(fn($item) => [
            'value' => $item->id_stase,
            'label' => $item->nama_stase
        ]);

        return Inertia::render('Admin/OsceJadwalPage', [
            'osce' => $osce,
            'sesi' => $sesi_data,
            'filters' => ['search' => $search],
            'master_stase' => $master_stase,
        ]);
    }

    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'tanggal' => 'required|date',
                'jam_mulai' => 'required',
                'durasi' => 'required|numeric',
            ]);

            $start = Carbon::parse($request->jam_mulai);
            $end = $start->copy()->addMinutes((int)$request->durasi);

            $startStr = $start->format('H:i:s');
            $endStr = $end->format('H:i:s');

            $busyRuangIds = OsceStase::where('tanggal', $request->tanggal)
                ->where(function ($q) use ($startStr, $endStr) {
                    $q->where('jam_mulai', '<', $endStr)
                        ->where('jam_selesai', '>', $startStr);
                })
                ->pluck('id_ruang')
                ->toArray();

            $busyPengujiIds = OsceStase::where('tanggal', $request->tanggal)
                ->where(function ($q) use ($startStr, $endStr) {
                    $q->where('jam_mulai', '<', $endStr)
                        ->where('jam_selesai', '>', $startStr);
                })
                ->pluck('id_penguji')
                ->toArray();

            $availableRooms = Ruang::whereNotIn('id_ruang', $busyRuangIds)
                ->select('id_ruang', 'nomor_ruangan', 'lokasi')
                ->get()
                ->map(fn($r) => [
                    'value' => $r->id_ruang,
                    'label' => $r->nomor_ruangan . ' - ' . $r->lokasi
                ]);

            $availablePenguji = Penguji::whereNotIn('id_penguji', $busyPengujiIds)
                ->select('id_penguji', 'nama', 'nip')
                ->get()
                ->map(fn($p) => [
                    'value' => $p->id_penguji,
                    'label' => $p->nama . ($p->nip ? ' (NIP: ' . $p->nip . ')' : '')
                ]);

            return response()->json([
                'status' => 'success',
                'rooms' => $availableRooms,
                'penguji' => $availablePenguji,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API untuk mengambil data mahasiswa berdasarkan filter tahun akademik
     */
    public function getMahasiswa(Request $request)
    {
        $id_osce = $request->id_osce;
        $tahun_filter = $request->angkatan;

        $booked_ids = [];
        if ($id_osce) {
            $booked_ids = EnrollmentOsce::where('id_osce', $id_osce)
                ->pluck('id_mahasiswa')
                ->toArray();
        }

        $query = Mahasiswa::query()
            ->select('id_mahasiswa', 'nama', 'nim')
            ->orderBy('nim', 'asc');

        if ($tahun_filter) { 
            
            $tahun_target = substr($tahun_filter, 0, 4); 

            $query->whereHas('enrollment.tahunAkademik', function ($q) use ($tahun_filter) {
                $q->where('tahun', $tahun_filter);
            })
            ->whereDoesntHave('enrollment.tahunAkademik', function ($q) use ($tahun_target) {
                $q->whereRaw('CAST(SUBSTRING(tahun, 1, 4) AS UNSIGNED) < ?', [(int)$tahun_target]);
            });
        }

        $mahasiswa = $query->get()->map(fn($m) => [
            'value' => $m->id_mahasiswa,
            'label' => "{$m->nim} - {$m->nama}",
            'already_enrolled' => in_array($m->id_mahasiswa, $booked_ids)
        ]);

        $list_angkatan = TahunAkademik::whereHas('enrollment')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        return response()->json([
            'mahasiswa' => $mahasiswa,
            'list_angkatan' => $list_angkatan
        ]);
    }

    /**
     * Menyimpan data Jadwal/Sesi baru BESERTA Enrollment Mahasiswa
     */
    public function store(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        $validated = $request->validate([
            'tanggal'       => 'required|date',
            'jam_mulai'     => 'required',
            'durasi'        => 'required|numeric',
            'stase_ids'     => 'required|array|min:1',
            'id_ruang'      => 'required',
            'penguji_map'   => 'required|array',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswa,id_mahasiswa',
        ]);

        $inputDate = Carbon::parse($validated['tanggal'])->startOfDay();
        $startDate = Carbon::parse($osce->tanggal_mulai)->startOfDay();
        $endDate   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

        if ($inputDate->lessThan($startDate) || $inputDate->greaterThan($endDate)) {
            return redirect()->back()
                ->with('error', 'Tanggal yang dipilih (' . $validated['tanggal'] . ') di luar periode pelaksanaan OSCE (' . $osce->tanggal_mulai . ' s.d ' . $osce->tanggal_selesai . ').')
                ->withInput();
        }

        $jumlah_stase = count($validated['stase_ids']);
        $jumlah_mahasiswa = count($validated['mahasiswa_ids'] ?? []);

        if ($jumlah_stase !== $jumlah_mahasiswa) {
            return redirect()->back()
                ->withErrors(['mahasiswa_ids' => "Jumlah mahasiswa ($jumlah_mahasiswa) harus sama dengan jumlah stase ($jumlah_stase)."])
                ->withInput();
        }

        $waktu_mulai = Carbon::parse($validated['jam_mulai']);
        $jam_fix = $waktu_mulai->format('H:i');
        $total_menit  = (int)$validated['durasi'] * $jumlah_stase;
        $waktu_selesai = $waktu_mulai->copy()->addMinutes($total_menit);

        DB::beginTransaction();
        try {
            foreach ($validated['stase_ids'] as $staseId) {
                $pengujiId = $validated['penguji_map'][$staseId] ?? null;
                if ($pengujiId) {
                    $new = new OsceStase();
                    $new->id_osce = $id_osce;
                    $new->id_stase = $staseId;
                    $new->id_ruang = $validated['id_ruang'];
                    $new->id_penguji = $pengujiId;
                    $new->tanggal = $validated['tanggal'];
                    $new->jam_mulai = $jam_fix;
                    $new->jam_selesai = $waktu_selesai->format('H:i');
                    $new->durasi_per_mahasiswa = $validated['durasi'];
                    $new->save();
                }
            }

            if (!empty($validated['mahasiswa_ids'])) {
                foreach ($validated['mahasiswa_ids'] as $mhsId) {

                    $alreadyBooked = EnrollmentOsce::where('id_osce', $id_osce)
                        ->where('id_mahasiswa', $mhsId)
                        ->exists();

                    if ($alreadyBooked) {
                        DB::rollBack();
                        $mhsName = Mahasiswa::find($mhsId)->nama ?? 'Mahasiswa';
                        return redirect()->back()
                            ->withErrors(['mahasiswa_ids' => "Gagal: $mhsName sudah memiliki jadwal di ujian ini."])
                            ->withInput();
                    }

                    $enroll = new EnrollmentOsce();
                    $enroll->id_osce      = $id_osce;
                    $enroll->id_mahasiswa = $mhsId;
                    $enroll->tanggal_sesi = $validated['tanggal'];
                    $enroll->jam_sesi     = $jam_fix;
                    $enroll->save();
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Jadwal Sesi & Mahasiswa Berhasil Disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSessionDetail(Request $request, $id_osce)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required'
        ]);

        $stase_list = OsceStase::with(['stase', 'penguji', 'ruang'])
            ->where('id_osce', $id_osce)
            ->where('tanggal', $request->tanggal)
            ->where('jam_mulai', $request->jam_mulai)
            ->get()
            ->map(fn($item) => [
                'stase' => $item->stase->nama_stase,
                'penguji' => $item->penguji->nama ?? '-',
                'ruang' => $item->ruang->nomor_ruangan . ' (' . $item->ruang->lokasi . ')'
            ]);

        $mahasiswa_list = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->where('tanggal_sesi', $request->tanggal)
            ->where('jam_sesi', $request->jam_mulai)
            ->get()
            ->map(fn($item) => [
                'nama' => $item->mahasiswa->nama,
                'nim' => $item->mahasiswa->nim
            ]);

        return response()->json([
            'stase_data' => $stase_list,
            'mahasiswa_data' => $mahasiswa_list
        ]);
    }


    public function create($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        $stase_options = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal') 
            ->with(['stase', 'ruang', 'penguji'])
            ->get()
            ->map(fn($item) => [
                'value' => $item->id_osce_stase,
                'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
            ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'stase_options' => $stase_options,
            'sesi' => null,
            'stase_terpilih' => [],
        ]);
    }

    /**
     * Menampilkan form untuk EDIT jadwal sesi
     * GET /admin/osce/{id_osce}/jadwal/{sesi_id}/edit
     */
    public function edit($id_osce, $sesi_id)
    {
        $osce = Osce::findOrFail($id_osce);

        list($tanggal, $jam_mulai_full) = explode('_', $sesi_id);

        $sesi_data = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('tanggal', 'jam_mulai', 'jam_selesai')
            ->first();

        if (!$sesi_data) {
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('error', 'Sesi tidak ditemukan.');
        }

        $tanggal_formatted = (new \DateTime($sesi_data->tanggal))->format('Y-m-d');

        $sesi = (object)[
            'tanggal' => $tanggal_formatted,
            'jam_mulai' => substr($sesi_data->jam_mulai, 0, 5),
            'jam_selesai' => substr($sesi_data->jam_selesai, 0, 5),
            'jam_mulai_full' => $sesi_data->jam_mulai,
        ];

        $stase_options = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal') 
            ->with(['stase', 'ruang', 'penguji'])
            ->get();

        $stase_in_session = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('id_stase', 'id_penguji', 'id_ruang') 
            ->get();

        $stase_terpilih_ids = [];

        foreach ($stase_options as $template) {
            $is_selected = $stase_in_session->first(function ($session_instance) use ($template) {
                return $session_instance->id_stase === $template->id_stase &&
                    $session_instance->id_penguji === $template->id_penguji &&
                    $session_instance->id_ruang === $template->id_ruang;
            });

            if ($is_selected) {
                $stase_terpilih_ids[] = $template->id_osce_stase;
            }
        }

        $stase_options_formatted = $stase_options->map(fn($item) => [
            'value' => $item->id_osce_stase,
            'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
        ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'sesi' => $sesi,
            'stase_options' => $stase_options_formatted,
            'stase_terpilih' => array_unique($stase_terpilih_ids), 
        ]);
    }

    public function update(Request $request, $id_osce, $sesi_id)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        list($old_tanggal, $old_jam_mulai) = explode('_', $sesi_id);

        DB::beginTransaction();
        try {
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $old_tanggal)
                ->where('jam_mulai', $old_jam_mulai)
                ->delete(); 

            foreach ($validated['stase_ids'] as $template_stase_id) {
                $template = OsceStase::find($template_stase_id);
                if ($template) {
                    $new_sesi_stase = $template->replicate();

                    $new_sesi_stase->tanggal = $validated['tanggal'];
                    $new_sesi_stase->jam_mulai = $validated['jam_mulai'];
                    $new_sesi_stase->jam_selesai = $validated['jam_selesai'];

                    $new_sesi_stase->save();
                }
            }

            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui jadwal: ' . $e->getMessage());
        }
    }

    public function destroy($id_osce, $sesi_id)
    {
        list($tanggal, $jam_mulai) = explode('_', $sesi_id);

        DB::beginTransaction();
        try {
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $tanggal)
                ->where('jam_mulai', $jam_mulai)
                ->delete();

            EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $tanggal)
                ->where('jam_sesi', $jam_mulai)
                ->delete();

            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi dan enrollment mahasiswa berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }
}
