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

        // 1. Ambil Data Penguji
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        // Gunakan Timezone Jakarta untuk konsistensi
        $now = Carbon::now('Asia/Jakarta');
        $todayStr = $now->toDateString(); // Format Y-m-d

        // 2. Statistik Query
        $baseStaseQuery = OsceStase::where('id_penguji', $penguji->id_penguji);

        $statistik = [
            // MENDATANG:
            // Tanggal besok dst... ATAU Hari ini tapi jam mulai belum lewat
            'osce_mendatang' => (clone $baseStaseQuery)
                ->where(function ($q) use ($now, $todayStr) {
                    $q->whereDate('tanggal', '>', $todayStr)
                      ->orWhere(function ($sub) use ($now, $todayStr) {
                          $sub->whereDate('tanggal', $todayStr)
                              ->whereTime('jam_mulai', '>', $now->toTimeString());
                      });
                })->count(),

            // MASA PENILAIAN (AKTIF):
            // [UBAH LOGIKA]: Hari ini DAN Jam Mulai sudah lewat.
            // Tidak peduli jam selesai sesi, pokoknya aktif sampai tengah malam.
            'osce_edit_nilai' => (clone $baseStaseQuery)
                ->whereDate('tanggal', $todayStr)
                ->whereTime('jam_mulai', '<=', $now->toTimeString())
                ->count(),

            // SELESAI:
            // [UBAH LOGIKA]: Hanya tanggal KEMARIN dan sebelumnya.
            // Hari ini tidak dianggap selesai meskipun jam sesi berakhir.
            'osce_selesai' => (clone $baseStaseQuery)
                ->whereDate('tanggal', '<', $todayStr)
                ->count(),
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
            $jadwalQuery->whereDate('tanggal', '>=', $todayStr)
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

                // Waktu Mulai Sesi
                $staseStart = Carbon::parse($tglStaseStr . ' ' . $stase->jam_mulai, 'Asia/Jakarta');

                // [PERBAIKAN LOGIKA DISINI]
                // Batas akhir status "Aktif/Edit" adalah AKHIR HARI (23:59:59), bukan jam selesai sesi.
                $endOfDay = Carbon::parse($tglStaseStr, 'Asia/Jakarta')->endOfDay();

                // Logika Status Dashboard
                $status = 'mendatang';

                // Jika sekarang sudah melewati akhir hari ujian => Selesai
                if ($now->greaterThan($endOfDay)) {
                    $status = 'selesai';
                } 
                // Jika belum lewat akhir hari, tapi sudah lewat jam mulai => Edit (Aktif)
                elseif ($now->greaterThanOrEqualTo($staseStart)) {
                    $status = 'edit';
                } 
                // Sisanya => Mendatang
                else {
                    $status = 'mendatang';
                }

                // Hitung Mahasiswa Sesi Ini
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
            // Karena definisi 'selesai' sekarang adalah "Kemarin", maka ujian hari ini 
            // yang jam sesinya sudah lewat tetap akan muncul di list ini (sebagai status 'edit')
            ->filter(function ($item) {
                return $item['status'] !== 'selesai'; 
            })
            // --- LIMIT: AMBIL 5 TERATAS SETELAH DIFILTER ---
            ->take(5)
            // --- VALUES: RESET INDEX ARRAY ---
            ->values();

        return Inertia::render('Penguji/PengujiDashboard', [
            'nama_penguji'   => $penguji->nama,
            'statistik'      => $statistik,
            'jadwal_mendatang' => $jadwalMendatang,
            'selected_date'  => $request->date ?? null
        ]);
    }
}