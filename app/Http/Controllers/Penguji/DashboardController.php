<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Penguji;
use App\Models\OsceStase;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // ambil user login & data penguji terkait
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id)->firstOrFail();

        // Ambil semua stase yang ditugaskan ke penguji ini
        // load relasi 'osce' karena tanggal dan status ada di tabel osce
        $assignments = OsceStase::with('osce')
            ->where('id_penguji', $penguji->id_penguji)
            ->get();

        // Hitung Statistik (Unik berdasarkan ID OSCE)
        // Kita group by ID OSCE agar jika penguji punya 2 jadwal di 1 OSCE, tetap terhitung 1 OSCE
        $uniqueOsces = $assignments->pluck('osce')->unique('id_osce');
        
        $now = Carbon::now();

        $stats = [
            'osce_mendatang'  => $uniqueOsces->filter(fn($o) => $now->lt($o->tanggal_mulai))->count(),
            'osce_edit_nilai' => $uniqueOsces->filter(fn($o) => $now->between($o->tanggal_mulai, $o->tanggal_selesai))->count(),
            'osce_selesai'    => $uniqueOsces->filter(fn($o) => $now->gt($o->tanggal_selesai))->count(),
        ];

        // Jadwal Penting (Status "Sedang Berlangsung")
        // Menampilkan stase spesifik yang sedang aktif hari ini/saat ini
        $jadwalPenting = $assignments->filter(function ($stase) use ($now) {
            return $now->between($stase->osce->tanggal_mulai, $stase->osce->tanggal_selesai);
        })->map(function ($stase) {
            return [
                'id_osce'       => $stase->id_osce,
                'id_osce_stase' => $stase->id_osce_stase,
                'nama_osce'     => $stase->osce->nama_osce,
                'status'        => 'Sedang Berlangsung'
            ];
        })->values(); // Reset keys agar jadi array JSON cantik

        // Jadwal 7 Hari Kedepan (Berdasarkan tanggal spesifik sesi/stase)
        $jadwal7Hari = OsceStase::with('osce')
            ->where('id_penguji', $penguji->id_penguji)
            ->whereBetween('tanggal', [$now->format('Y-m-d'), $now->addDays(7)->format('Y-m-d')])
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get()
            ->map(function ($stase) {
                return [
                    'id_osce'   => $stase->id_osce,
                    'tanggal'   => $stase->tanggal->format('d-m-Y'), // Format sesuai selera UI
                    'nama_osce' => $stase->osce->nama_osce,
                    'status'    => 'Mendatang'
                ];
            });

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji' => $penguji->nama, // Ambil dari tabel penguji, bukan user
            'statistik'    => $stats,
            'jadwal_penting' => $jadwalPenting,
            'jadwal_7_hari'  => $jadwal7Hari
        ]);
    }
}