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

        // 2. Statistik Query (Tetap sama, tidak terpengaruh filter kalender)
        $baseOsceQuery = Osce::whereHas('osceStase', function ($q) use ($penguji) {
            $q->where('id_penguji', $penguji->id_penguji);
        });

        $statistik = [
            'osce_mendatang'  => (clone $baseOsceQuery)->whereDate('tanggal_mulai', '>', $now)->count(),
            'osce_edit_nilai' => (clone $baseOsceQuery)
                ->whereDate('tanggal_mulai', '<=', $now)
                ->whereDate('tanggal_selesai', '>=', $now)
                ->count(),
            'osce_selesai'    => (clone $baseOsceQuery)->whereDate('tanggal_selesai', '<', $now)->count(),
        ];

        // 3. LOGIKA JADWAL (Dimodifikasi untuk Filter)
        $jadwalQuery = OsceStase::with(['osce.enrollmentOsce'])
            ->where('id_penguji', $penguji->id_penguji);

        // [MODIFIKASI] Cek apakah ada parameter 'date' dari frontend
        if ($request->has('date') && $request->date) {
            // Jika user memilih tanggal di kalender, cari jadwal HANYA di tanggal itu
            $filterDate = Carbon::parse($request->date);
            $jadwalQuery->whereDate('tanggal', $filterDate);

            // Urutkan berdasarkan jam
            $jadwalQuery->orderBy('jam_mulai', 'asc');
        } else {
            // LOGIKA DEFAULT (Jika tidak ada tanggal dipilih)
            // Tampilkan jadwal dari hari ini sampai 30 hari ke depan, limit 5
            $jadwalQuery->whereDate('tanggal', '>=', $now)
                ->whereDate('tanggal', '<=', $now->copy()->addDays(30))
                ->orderBy('tanggal', 'asc')
                ->orderBy('jam_mulai', 'asc')
                ->take(5);
        }

        // Eksekusi Query dan Formatting Data
        $jadwalMendatang = $jadwalQuery->get()
            ->map(function ($stase) use ($now) {
                $osce = $stase->osce;

                $staseStart = Carbon::parse($stase->tanggal->format('Y-m-d') . ' ' . $stase->jam_mulai);
                $eventEnd = Carbon::parse($osce->tanggal_selesai)->endOfDay();

                $status = 'mendatang';

                if ($now->gt($eventEnd)) {
                    $status = 'selesai';
                } elseif ($now->gte($staseStart) && $now->lte($eventEnd)) {
                    $status = 'edit';
                } else {
                    $status = 'mendatang';
                }

                return [
                    'id_osce'        => $osce->id_osce,
                    'id_osce_stase'  => $stase->id_osce_stase,
                    'nama_osce'      => $osce->nama_osce,
                    'hari'           => $stase->tanggal->format('d'),
                    'bulan'          => $stase->tanggal->format('M'),
                    'sesi'           => substr($stase->jam_mulai, 0, 5),
                    'jumlah_mahasiswa' => $osce->enrollmentOsce->count(),
                    'status'         => $status,
                ];
            });

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'     => $penguji->nama,
            'statistik'        => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            // Opsional: Balikin tanggal yang dipilih biar UI tahu
            'selected_date'    => $request->date ?? null
        ]);
    }
}
