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

        // Gunakan Timezone Jakarta untuk konsistensi
        $now = Carbon::now('Asia/Jakarta');

        // 2. Statistik Query
        $baseStaseQuery = OsceStase::where('id_penguji', $penguji->id_penguji);

        $statistik = [
            // MENDATANG:
            // Tanggalnya besok/lusa dst...
            // ATAU Hari ini tapi jam mulainya belum lewat
            'osce_mendatang' => (clone $baseStaseQuery)
                ->where(function ($q) use ($now) {
                    $q->whereDate('tanggal', '>', $now)
                      ->orWhere(function ($sub) use ($now) {
                          $sub->whereDate('tanggal', $now)
                              ->whereTime('jam_mulai', '>', $now);
                      });
                })->count(),

            // MASA PENILAIAN (SEDANG BERLANGSUNG):
            // Hari ini, jam sekarang ada di antara jam mulai dan selesai
            'osce_edit_nilai' => (clone $baseStaseQuery)
                ->whereDate('tanggal', $now)
                ->whereTime('jam_mulai', '<=', $now)
                ->whereTime('jam_selesai', '>=', $now)
                ->count(),

            // SELESAI:
            // Tanggalnya kemarin dst...
            // ATAU Hari ini tapi jam selesainya sudah lewat
            'osce_selesai' => (clone $baseStaseQuery)
                ->where(function ($q) use ($now) {
                    $q->whereDate('tanggal', '<', $now)
                      ->orWhere(function ($sub) use ($now) {
                          $sub->whereDate('tanggal', $now)
                              ->whereTime('jam_selesai', '<', $now);
                      });
                })->count(),
        ];

        // 3. LOGIKA JADWAL
        $jadwalQuery = OsceStase::with(['osce.enrollmentOsce'])
            ->where('id_penguji', $penguji->id_penguji);

        if ($request->has('date') && $request->date) {
            // Filter Tanggal Spesifik
            $filterDate = Carbon::parse($request->date);
            $jadwalQuery->whereDate('tanggal', $filterDate);
            $jadwalQuery->orderBy('jam_mulai', 'asc');
        } else {
            // DEFAULT: Tampilkan jadwal hari ini s/d 30 hari ke depan
            // CATATAN: Hapus 'take(5)' dari sini agar kita bisa filter dulu di PHP
            $jadwalQuery->whereDate('tanggal', '>=', $now)
                ->whereDate('tanggal', '<=', $now->copy()->addDays(30))
                ->orderBy('tanggal', 'asc')
                ->orderBy('jam_mulai', 'asc');
        }

        // 4. Eksekusi, Mapping, Filtering
        $jadwalMendatang = $jadwalQuery->get()
            ->map(function ($stase) {
                $osce = $stase->osce;
                
                // Gunakan Timezone Jakarta saat parsing
                $now = Carbon::now('Asia/Jakarta');

                $tglStaseStr = $stase->tanggal instanceof \DateTime 
                    ? $stase->tanggal->format('Y-m-d') 
                    : $stase->tanggal;

                $staseStart = Carbon::parse($tglStaseStr . ' ' . $stase->jam_mulai, 'Asia/Jakarta');

                // Tentukan Jam Selesai Sesi
                if (!empty($stase->jam_selesai)) {
                    $staseEnd = Carbon::parse($tglStaseStr . ' ' . $stase->jam_selesai, 'Asia/Jakarta');
                } else {
                    $staseEnd = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();
                }

                // Logika Status
                $status = 'mendatang';
                if ($now->greaterThan($staseEnd)) {
                    $status = 'selesai';
                } elseif ($now->greaterThanOrEqualTo($staseStart) && $now->lessThanOrEqualTo($staseEnd)) {
                    $status = 'edit';
                } else {
                    $status = 'mendatang';
                }

                $staseJamMulai = substr($stase->jam_mulai, 0, 5);

                $jumlahMahasiswaSesi = $osce->enrollmentOsce
                    ->filter(function ($enrollment) use ($tglStaseStr, $staseJamMulai) {
                        $enrollmentTanggal = Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
                        $enrollmentJam = substr($enrollment->jam_sesi, 0, 5); 
                        return $enrollmentTanggal === $tglStaseStr && $enrollmentJam === $staseJamMulai;
                    })
                    ->count();

                return [
                    'id_osce'        => $osce->id_osce,
                    'id_osce_stase'  => $stase->id_osce_stase,
                    'nama_osce'      => $osce->nama_osce,
                    'hari'           => Carbon::parse($tglStaseStr)->format('d'),
                    'bulan'          => Carbon::parse($tglStaseStr)->format('M'),
                    'sesi'           => substr($stase->jam_mulai, 0, 5),
                    'jumlah_mahasiswa' => $jumlahMahasiswaSesi,
                    'status'         => $status,
                ];
            })
            // --- FILTER: HANYA TAMPILKAN YANG BELUM SELESAI ---
            ->filter(function ($item) {
                // Return true untuk menyimpan item, false untuk membuang
                return $item['status'] !== 'selesai'; 
            })
            // --- LIMIT: AMBIL 5 TERATAS SETELAH DIFILTER ---
            ->take(5)
            // --- VALUES: RESET INDEX ARRAY (Agar JSON rapi [0,1,2]) ---
            ->values();

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'   => $penguji->nama,
            'statistik'      => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            'selected_date'  => $request->date ?? null
        ]);
    }
}
