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
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        $now = Carbon::now('Asia/Jakarta');
        $todayStr = $now->toDateString();

        $baseStaseQuery = OsceStase::where('id_penguji', $penguji->id_penguji);

        $statistik = [
            'osce_mendatang' => (clone $baseStaseQuery)
                ->where(function ($q) use ($now, $todayStr) {
                    $q->whereDate('tanggal', '>', $todayStr)
                      ->orWhere(function ($sub) use ($now, $todayStr) {
                          $sub->whereDate('tanggal', $todayStr)
                              ->whereTime('jam_mulai', '>', $now->toTimeString());
                      });
                })->count(),

            'osce_edit_nilai' => (clone $baseStaseQuery)
                ->whereDate('tanggal', $todayStr)
                ->whereTime('jam_mulai', '<=', $now->toTimeString())
                ->count(),

            'osce_selesai' => (clone $baseStaseQuery)
                ->whereDate('tanggal', '<', $todayStr)
                ->count(),
        ];

        $calendarEvents = OsceStase::where('id_penguji', $penguji->id_penguji)
            ->select('tanggal')
            ->distinct()
            ->get()
            ->map(function ($item) {
                return Carbon::parse($item->tanggal)->format('Y-m-d');
            })
            ->toArray();

        $jadwalQuery = OsceStase::with(['osce.enrollmentOsce.nilaiOsce'])
            ->where('id_penguji', $penguji->id_penguji);

        if ($request->has('date') && $request->date) {
            $filterDate = Carbon::parse($request->date);
            $jadwalQuery->whereDate('tanggal', $filterDate);
        } else {
            $jadwalQuery->whereDate('tanggal', '>=', $todayStr)
                ->whereDate('tanggal', '<=', $now->copy()->addDays(30));
        }
        
        $jadwalQuery->orderBy('tanggal', 'asc')->orderBy('jam_mulai', 'asc');

        $jadwalMendatang = $jadwalQuery->get()
            ->map(function ($stase) {
                $osce = $stase->osce;
                $now = Carbon::now('Asia/Jakarta');

                $tglStaseStr = $stase->tanggal instanceof \DateTime 
                    ? $stase->tanggal->format('Y-m-d') 
                    : $stase->tanggal;

                $startEvent = Carbon::parse($tglStaseStr . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
                $endEvent   = Carbon::parse($tglStaseStr . ' ' . $stase->jam_selesai, 'Asia/Jakarta');
                $globalEndDate = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();

                $staseJamMulai = substr($stase->jam_mulai, 0, 5);
                
                $pesertaSesi = $osce->enrollmentOsce
                    ->filter(function ($enrollment) use ($tglStaseStr, $staseJamMulai) {
                        $enrollmentTanggal = Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
                        $enrollmentJam = substr($enrollment->jam_sesi, 0, 5); 
                        return $enrollmentTanggal === $tglStaseStr && $enrollmentJam === $staseJamMulai;
                    });

                $jumlahMahasiswaSesi = $pesertaSesi->count();

                $jumlahDinilai = $pesertaSesi->filter(function($mhs) {
                    if ($mhs->nilaiOsce instanceof \Illuminate\Database\Eloquent\Collection) {
                        return $mhs->nilaiOsce->isNotEmpty();
                    }
                    return $mhs->nilaiOsce !== null;
                })->count();

                $isFullGraded = ($jumlahMahasiswaSesi > 0 && $jumlahMahasiswaSesi === $jumlahDinilai);

                $status = 'Aktif'; 
                if ($now->greaterThan($globalEndDate)) {
                    $status = 'Selesai';
                } elseif ($now->lessThan($startEvent)) {
                    $status = 'Belum Dimulai';
                } else {
                    if ($isFullGraded) {
                        $status = 'Telah Dinilai';
                    } else {
                        if ($now->greaterThan($endEvent)) {
                            $status = 'Belum Dinilai'; 
                        } else {
                            $status = 'Aktif'; 
                        }
                    }
                }

                $statusPriority = [
                    'Aktif'         => 1, 
                    'Belum Dinilai' => 2, 
                    'Belum Dimulai' => 3, 
                    'Telah Dinilai' => 4, 
                    'Selesai'       => 5, 
                ];
                $urutanPrioritas = $statusPriority[$status] ?? 99;

                return [
                    'id_osce'          => $osce->id_osce,
                    'id_osce_stase'    => $stase->id_osce_stase,
                    'nama_osce'        => $osce->nama_osce,
                    'hari'             => Carbon::parse($tglStaseStr)->format('d'),
                    'bulan'            => Carbon::parse($tglStaseStr)->format('M'),
                    'sesi'             => substr($stase->jam_mulai, 0, 5),
                    'jumlah_mahasiswa' => $jumlahMahasiswaSesi,
                    'status'           => $status,
                    'urutan_prioritas' => $urutanPrioritas,
                    'waktu_mulai_unix' => $startEvent->timestamp
                ];
            })
            ->filter(function ($item) {
                return $item['status'] !== 'Selesai'; 
            })
            ->sortBy([
                ['urutan_prioritas', 'asc'],
                ['waktu_mulai_unix', 'asc'],
            ])
            ->take(5)
            ->values();

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'     => $penguji->nama,
            'statistik'        => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            'selected_date'    => $request->date ?? null,
            'calendar_events'  => $calendarEvents,
        ]);
    }
}