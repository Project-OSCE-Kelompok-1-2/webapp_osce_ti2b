<?php

namespace App\Services;

use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OsceJadwalService
{
    /**
     * Mendapatkan daftar jadwal sesi (dikelompokkan per tanggal & jam).
     */
    public function getJadwalList(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $search = $request->query('search');

        // Query grouping
        $sesi_virtual_query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal')
            ->select('tanggal', 'jam_mulai', DB::raw('MIN(id_osce_stase) as id_osce_stase'))
            ->groupBy('tanggal', 'jam_mulai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc');

        if ($search) {
            $sesi_virtual_query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi_paginated = $sesi_virtual_query->paginate(10)->withQueryString();

        // Transformasi data agar output JSON sesuai spesifikasi yang diminta
        $sesi_data = $sesi_paginated->through(function ($sesi) use ($id_osce) {
            // Hitung jumlah mahasiswa
            $jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi->tanggal)
                ->where('jam_sesi', $sesi->jam_mulai)
                ->count();

            // Return ARRAY BARU sesuai struktur permintaan
            return [
                'id_osce_stase' => (int) $sesi->id_osce_stase, // Integer ID
                'tanggal' => $sesi->tanggal,                    // Format YYYY-MM-DD
                'jam_mulai' => $sesi->jam_mulai,                // Format HH:MM:SS
                'jumlah_mahasiswa' => (int) $jumlah_mahasiswa,  // Integer
            ];
        });

        return [
            'osce' => $osce,
            'sesi' => $sesi_data
        ];
    }

    /**
     * Mendapatkan opsi template stase (untuk form create/edit).
     */
    public function getTemplates($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        $templates = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal')
            ->with(['stase', 'ruang', 'penguji'])
            ->get()
            ->map(fn($item) => [
                'value' => $item->id_osce_stase,
                'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
            ]);

        return [
            'osce' => $osce,
            'templates' => $templates
        ];
    }

    /**
     * Membuat jadwal baru berdasarkan template.
     */
    public function createSession(Request $request, $id_osce)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        return DB::transaction(function () use ($validated) {
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
            return true;
        });
    }

    /**
     * Helper privat untuk menyelesaikan target Tanggal & Jam dari ID (baik integer maupun string)
     */
    private function resolveSessionTarget($id_osce, $sesi_id)
    {
        // Coba cari berdasarkan ID (integer)
        $refStase = OsceStase::where('id_osce', $id_osce)
            ->where('id_osce_stase', $sesi_id)
            ->first();

        if ($refStase) {
            return [
                'tanggal' => $refStase->tanggal,
                'jam_mulai' => $refStase->jam_mulai
            ];
        }

        // Fallback: Cek format composite string (YYYY-MM-DD_HH:mm:ss)
        if (str_contains($sesi_id, '_')) {
            list($tgl, $jam) = explode('_', $sesi_id);
            return [
                'tanggal' => $tgl,
                'jam_mulai' => $jam
            ];
        }

        return null;
    }

    /**
     * Mengambil detail sesi untuk diedit.
     */
    public function getSessionDetail($id_osce, $sesi_id)
    {
        // Gunakan helper untuk mencari target tanggal/jam
        $target = $this->resolveSessionTarget($id_osce, $sesi_id);

        if (!$target) {
            return null; // Not found
        }

        $tanggal = $target['tanggal'];
        $jam_mulai_full = $target['jam_mulai'];

        $osce = Osce::findOrFail($id_osce);

        $sesi_data = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('tanggal', 'jam_mulai', 'jam_selesai')
            ->first();

        if (!$sesi_data) {
            return null;
        }

        $templateData = $this->getTemplates($id_osce);
        $stase_options = $templateData['templates'];
        $raw_templates = OsceStase::where('id_osce', $id_osce)->whereNull('tanggal')->get();

        $stase_in_session = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('id_stase', 'id_penguji', 'id_ruang')
            ->get();

        $stase_terpilih_ids = [];
        foreach ($raw_templates as $template) {
            $is_selected = $stase_in_session->first(function ($session_instance) use ($template) {
                return $session_instance->id_stase === $template->id_stase &&
                    $session_instance->id_penguji === $template->id_penguji &&
                    $session_instance->id_ruang === $template->id_ruang;
            });

            if ($is_selected) {
                $stase_terpilih_ids[] = $template->id_osce_stase;
            }
        }

        return [
            'osce' => $osce,
            'sesi' => [
                'tanggal' => (new \DateTime($sesi_data->tanggal))->format('Y-m-d'),
                'jam_mulai' => substr($sesi_data->jam_mulai, 0, 5),
                'jam_selesai' => substr($sesi_data->jam_selesai, 0, 5),
                'id' => $sesi_id // Return ID asli yang diminta
            ],
            'stase_options' => $stase_options,
            'stase_terpilih' => array_unique($stase_terpilih_ids),
        ];
    }

    /**
     * Update sesi (Hapus lama -> Buat baru).
     */
    public function updateSession(Request $request, $id_osce, $sesi_id)
    {
        $target = $this->resolveSessionTarget($id_osce, $sesi_id);

        if (!$target) {
            throw ValidationException::withMessages(['id' => 'Sesi tidak ditemukan atau ID tidak valid.']);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        $old_tanggal = $target['tanggal'];
        $old_jam_mulai = $target['jam_mulai'];

        return DB::transaction(function () use ($id_osce, $old_tanggal, $old_jam_mulai, $validated) {
            // Hapus semua yang memiliki tanggal & jam lama
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $old_tanggal)
                ->where('jam_mulai', $old_jam_mulai)
                ->delete();

            // Buat baru
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
            return true;
        });
    }

    /**
     * Hapus sesi.
     */
    public function deleteSession($id_osce, $sesi_id)
    {
        // Cari target tanggal & jam berdasarkan ID (integer/string)
        $target = $this->resolveSessionTarget($id_osce, $sesi_id);

        if (!$target) {
            throw ValidationException::withMessages(['id' => 'Sesi tidak ditemukan atau ID tidak valid.']);
        }

        $tanggal = $target['tanggal'];
        $jam_mulai = $target['jam_mulai'];

        // Hapus semua baris yang cocok dengan tanggal & jam ini
        $deletedCount = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai)
            ->delete();

        if ($deletedCount === 0) {
            throw new \Exception("Sesi tidak ditemukan atau sudah dihapus.");
        }

        return true;
    }
}
