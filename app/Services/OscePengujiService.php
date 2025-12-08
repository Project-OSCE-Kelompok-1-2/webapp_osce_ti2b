<?php

namespace App\Services;

use App\Models\OsceStase;
use App\Models\Penguji;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;


class OscePengujiService
{
    /**
     * Mengambil data OSCE Stase khusus Penguji
     * Termasuk search, filter tahun, dan pagination
     */
    public function getAssignmentsForPenguji($user, $search, $tahun)
    {
        // 1. Ambil Data Penguji dari User Login
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        // 2. Query Dasar
        $query = OsceStase::with(['osce.enrollmentOsce', 'osce.tahunAkademik'])
            ->where('id_penguji', $penguji->id_penguji);

        // 3. Filter Search (berdasarkan nama OSCE)
        if ($search) {
            $query->whereHas('osce', function ($q) use ($search) {
                $q->where('nama_osce', 'like', "%{$search}%");
            });
        }

        // 4. Filter Tahun
        if ($tahun) {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', 'like', "%{$tahun}%");
            });
        }

        // 5. Pagination & Sorting
        $assignments = $query->orderBy('tanggal', 'desc')
                             ->paginate(10)
                             ->withQueryString();

        // 6. Transformasi Data (Sama persis dengan logika Inertia)
        // Menggunakan through() agar struktur pagination (current_page, last_page, dll) tetap ada
        $osceList = $assignments->through(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now();

            // Logika Status
            $status = 'Selesai';
            if ($now->lt($osce->tanggal_mulai)) {
                $status = 'Belum Dimulai';
            } elseif ($now->between($osce->tanggal_mulai, $osce->tanggal_selesai)) {
                $status = 'Aktif';
            } else {
                $status = 'Selesai';
            }

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce,
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                'status'           => $status,
                'jumlah_mahasiswa' => $osce->enrollmentOsce->count(),
                'sesi'             => substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
            ];
        });

        return $osceList;
    }
}