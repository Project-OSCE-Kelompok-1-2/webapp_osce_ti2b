<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Penguji;
use App\Models\OsceStase;
use App\Models\Osce;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        
        // 1. Ambil Data Penguji (Eager Load User untuk data login)
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();
        
        $now = Carbon::now();

        // Menggunakan query builder langsung ke OSCE untuk performa
        $baseOsceQuery = Osce::whereHas('osceStase', function($q) use ($penguji) {
            $q->where('id_penguji', $penguji->id_penguji);
        });

        $statistik = [
            'osce_mendatang'  => (clone $baseOsceQuery)->where('tanggal_mulai', '>', $now)->count(),
            'osce_edit_nilai' => (clone $baseOsceQuery)
                                ->where('tanggal_mulai', '<=', $now)
                                ->where('tanggal_selesai', '>=', $now)
                                ->count(),
            'osce_selesai'    => (clone $baseOsceQuery)->where('tanggal_selesai', '<', $now)->count(),
        ];

        $jadwalMendatang = OsceStase::with(['osce.enrollmentOsce']) 
            ->where('id_penguji', $penguji->id_penguji)
            ->whereDate('tanggal', '>=', $now)
            ->whereDate('tanggal', '<=', $now->copy()->addDays(30)) 
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->take(5) 
            ->get()
            ->map(function ($stase) use ($now) {
                $osce = $stase->osce;
                
                // Tentukan Status untuk UI (Warna badge)
                $status = 'mendatang';
                if ($now->between($osce->tanggal_mulai, $osce->tanggal_selesai)) {
                    $status = 'edit'; // Sedang Berlangsung / Masa Edit
                } elseif ($now->gt($osce->tanggal_selesai)) {
                    $status = 'selesai';
                }

                return [
                    'id_osce'          => $osce->id_osce,
                    'id_osce_stase'    => $stase->id_osce_stase,
                    'nama_osce'        => $osce->nama_osce,
                    // Data spesifik untuk UI Card
                    'hari'             => $stase->tanggal->format('d'), 
                    'bulan'            => $stase->tanggal->format('M'), 
                    'sesi'             => substr($stase->jam_mulai, 0, 5), 
                    'jumlah_mahasiswa' => $osce->enrollmentOsce->count(), 
                    'status'           => $status,
                ];
            });

        // Return ke Inertia dengan Props yang bersih
        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'     => $penguji->nama,
            'statistik'        => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
        ]);
    }
}