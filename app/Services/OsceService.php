<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Penguji;
use App\Models\OsceStase;

class OsceService
{
    /**
     * Mengambil daftar OSCE untuk penguji dengan filter dan pagination
     * * @param \App\Models\User $user
     * @param array $filters ['search' => ..., 'tahun' => ...]
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getOsceList($user, array $filters = [])
    {
        // 1. Ambil Data Penguji
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        $search = $filters['search'] ?? null;
        $tahun  = $filters['tahun'] ?? null;

        // 2. Query Dasar
        $query = OsceStase::with(['osce.enrollmentOsce', 'osce.tahunAkademik'])
            ->where('id_penguji', $penguji->id_penguji);

        // 3. Filter Search
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

        // 6. Transformasi Data (Logika Status)
        // Menggunakan through() agar transformasi dilakukan pada chunk data pagination saja
        return $assignments->through(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now();

            $startEvent = Carbon::parse($osce->tanggal_mulai)->startOfDay();
            $endEvent   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

            // Logika Status
            $status = 'Selesai';
            
            if ($now->lt($startEvent)) {
                $status = 'Belum Dimulai';
            } elseif ($now->between($startEvent, $endEvent)) {
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
    }
}