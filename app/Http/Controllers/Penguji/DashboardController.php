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
        
        // 1. Ambil Data Penguji
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();
        
        $now = Carbon::now();

        // 2. Statistik Query (Base Query)
        $baseOsceQuery = Osce::whereHas('osceStase', function($q) use ($penguji) {
            $q->where('id_penguji', $penguji->id_penguji);
        });

        // Hitung Statistik dengan Boundary hari yang tepat
        $statistik = [
            'osce_mendatang'  => (clone $baseOsceQuery)->whereDate('tanggal_mulai', '>', $now)->count(),
            'osce_edit_nilai' => (clone $baseOsceQuery)
                                ->whereDate('tanggal_mulai', '<=', $now)
                                ->whereDate('tanggal_selesai', '>=', $now)
                                ->count(),
            'osce_selesai'    => (clone $baseOsceQuery)->whereDate('tanggal_selesai', '<', $now)->count(),
        ];

        // 3. Jadwal Mendatang (Next 5 items)
        $jadwalMendatang = OsceStase::with(['osce.enrollmentOsce']) 
            ->where('id_penguji', $penguji->id_penguji)
            // Tampilkan jadwal dari hari ini sampai 30 hari ke depan
            ->whereDate('tanggal', '>=', $now)
            ->whereDate('tanggal', '<=', $now->copy()->addDays(30)) 
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->take(5) 
            ->get()
            ->map(function ($stase) use ($now) {
                $osce = $stase->osce;
                
                $staseStart = Carbon::parse($stase->tanggal->format('Y-m-d') . ' ' . $stase->jam_mulai);
                
                // Batas akhir penilaian adalah akhir hari dari Tanggal Selesai Event OSCE
                $eventEnd = Carbon::parse($osce->tanggal_selesai)->endOfDay();

                $status = 'mendatang';

                if ($now->gt($eventEnd)) {
                    // Jika hari ini > tanggal selesai event
                    $status = 'selesai';
                } elseif ($now->gte($staseStart) && $now->lte($eventEnd)) {
                    // Jika sekarang >= Jam Mulai Sesi DAN sekarang <= Akhir Event
                    // Artinya ujian sudah dimulai/sedang berlangsung
                    $status = 'edit'; 
                } else {
                    // Jika sekarang < Jam Mulai Sesi (Misal ujian nanti sore, sekarang pagi)
                    $status = 'mendatang';
                }

                return [
                    'id_osce'          => $osce->id_osce,
                    'id_osce_stase'    => $stase->id_osce_stase,
                    'nama_osce'        => $osce->nama_osce,
                    'hari'             => $stase->tanggal->format('d'), 
                    'bulan'            => $stase->tanggal->format('M'), 
                    'sesi'             => substr($stase->jam_mulai, 0, 5), 
                    'jumlah_mahasiswa' => $osce->enrollmentOsce->count(), 
                    'status'           => $status, // 'mendatang', 'edit', 'selesai'
                ];
            });

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'     => $penguji->nama,
            'statistik'        => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
        ]);
    }
}