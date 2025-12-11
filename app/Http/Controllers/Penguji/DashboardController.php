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
        
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();
        
        $now = Carbon::now();

        // -----------------------------
        // FILTER TANGGAL (DITAMBAHKAN)
        // -----------------------------
        $selectedDate = $request->tanggal ? Carbon::parse($request->tanggal)->format('Y-m-d') : null;

        // -----------------------------
        // BASE QUERY
        // -----------------------------
        $baseOsceQuery = Osce::whereHas('osceStase', function($q) use ($penguji) {
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

        // -----------------------------
        // JADWAL (EDITED)
        // Jika ada tanggal dipilih → filter
        // Jika tidak → standar 30 hari ke depan
        // -----------------------------
        $jadwalQuery = OsceStase::with(['osce.enrollmentOsce'])
            ->where('id_penguji', $penguji->id_penguji);

        if ($selectedDate) {
            $jadwalQuery->whereDate('tanggal', $selectedDate);
        } else {
            $jadwalQuery
                ->whereDate('tanggal', '>=', $now)
                ->whereDate('tanggal', '<=', $now->copy()->addDays(30));
        }

        $jadwalMendatang = $jadwalQuery
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get()
            ->map(function ($stase) use ($now) {
                $osce = $stase->osce;
                $staseStart = Carbon::parse($stase->tanggal->format('Y-m-d') . ' ' . $stase->jam_mulai);
                $eventEnd   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

                $status = 'mendatang';
                
                if ($now->gt($eventEnd)) {
                    $status = 'selesai';
                } elseif ($now->gte($staseStart) && $now->lte($eventEnd)) {
                    $status = 'edit';
                }

                return [
                    'id_osce'          => $osce->id_osce,
                    'id_osce_stase'    => $stase->id_osce_stase,
                    'nama_osce'        => $osce->nama_osce,
                    'hari'             => $stase->tanggal->format('d'),
                    'bulan'            => $stase->tanggal->format('M'),
                    'sesi'             => substr($stase->jam_mulai, 0, 5),
                    'jumlah_mahasiswa' => $osce->enrollmentOsce->count(),
                    'status'           => $status,
                ];
            });

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'     => $penguji->nama,
            'statistik'        => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            'selected_date'    => $selectedDate, // NEW
        ]);
    }
}

