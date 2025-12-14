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

        // 2. Statistik Query (Tidak diubah, hanya query kasar untuk angka)
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

        // 3. LOGIKA JADWAL
        $jadwalQuery = OsceStase::with(['osce.enrollmentOsce.nilaiOsce'])
            ->where('id_penguji', $penguji->id_penguji);

        if ($request->has('date') && $request->date) {
            $filterDate = Carbon::parse($request->date);
            $jadwalQuery->whereDate('tanggal', $filterDate);
        } else {
            // Tampilkan jadwal dari hari ini sampai 30 hari ke depan
            $jadwalQuery->whereDate('tanggal', '>=', $todayStr)
                ->whereDate('tanggal', '<=', $now->copy()->addDays(30));
        }
        
        // Sorting awal query
        $jadwalQuery->orderBy('tanggal', 'asc')->orderBy('jam_mulai', 'asc');

        // 4. Eksekusi & Mapping
        $jadwalMendatang = $jadwalQuery->get()
            ->map(function ($stase) {
                $osce = $stase->osce;
                $now = Carbon::now('Asia/Jakarta');

                $tglStaseStr = $stase->tanggal instanceof \DateTime 
                    ? $stase->tanggal->format('Y-m-d') 
                    : $stase->tanggal;

                // --- DEFINISI WAKTU ---
                // Start & End Sesi
                $startEvent = Carbon::parse($tglStaseStr . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
                $endEvent   = Carbon::parse($tglStaseStr . ' ' . $stase->jam_selesai, 'Asia/Jakarta');
                
                // End Global OSCE (Sesuai OsceController)
                $globalEndDate = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();

                // --- 1. HITUNG MAHASISWA & NILAI ---
                $staseJamMulai = substr($stase->jam_mulai, 0, 5);
                
                $pesertaSesi = $osce->enrollmentOsce
                    ->filter(function ($enrollment) use ($tglStaseStr, $staseJamMulai) {
                        $enrollmentTanggal = Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
                        $enrollmentJam = substr($enrollment->jam_sesi, 0, 5); 
                        return $enrollmentTanggal === $tglStaseStr && $enrollmentJam === $staseJamMulai;
                    });

                $jumlahMahasiswaSesi = $pesertaSesi->count();

                // Cek Nilai (Menggunakan logic collection isNotEmpty sesuai request)
                $jumlahDinilai = $pesertaSesi->filter(function($mhs) {
                    if ($mhs->nilaiOsce instanceof \Illuminate\Database\Eloquent\Collection) {
                        return $mhs->nilaiOsce->isNotEmpty();
                    }
                    return $mhs->nilaiOsce !== null;
                })->count();

                $isFullGraded = ($jumlahMahasiswaSesi > 0 && $jumlahMahasiswaSesi === $jumlahDinilai);

                // --- 2. LOGIKA STATUS (Sesuai OsceController) ---
                $status = 'Aktif'; 

                if ($now->greaterThan($globalEndDate)) {
                    $status = 'Selesai';
                }
                elseif ($now->lessThan($startEvent)) {
                    $status = 'Belum Dimulai';
                }
                else {
                    if ($isFullGraded) {
                        $status = 'Telah Dinilai';
                    } else {
                        if ($now->greaterThan($endEvent)) {
                            $status = 'Belum Dinilai'; // Sesi lewat, belum full dinilai
                        } else {
                            $status = 'Aktif'; // Masih dalam jam sesi
                        }
                    }
                }

                // --- 3. PRIORITAS SORTING ---
                $urutanPrioritas = 99;
                $statusPriority = [
                    'Aktif'         => 1, // Paling Atas
                    'Belum Dinilai' => 2, // Mendesak (sudah lewat jam)
                    'Telah Dinilai' => 3, 
                    'Belum Dimulai' => 4,
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
                    
                    // Data Internal untuk Sorting
                    'urutan_prioritas' => $urutanPrioritas,
                    'waktu_mulai_unix' => $startEvent->timestamp
                ];
            })
            // FILTER: Hapus yang 'Selesai' (Sudah lewat tanggal akhir OSCE)
            ->filter(function ($item) {
                return $item['status'] !== 'Selesai'; 
            })
            // SORTING
            ->sortBy([
                ['urutan_prioritas', 'asc'], // Sesuai prioritas status
                ['waktu_mulai_unix', 'asc'], // Sesuai waktu terdekat
            ])
            ->take(5)
            ->values();

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'   => $penguji->nama,
            'statistik'      => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            'selected_date'  => $request->date ?? null
        ]);
    }
}