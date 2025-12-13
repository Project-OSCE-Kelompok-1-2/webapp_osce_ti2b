<?php

namespace App\Http\Controllers\Mahasiswa;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Controller;
use App\Models\OsceStase;
use App\Models\NilaiOsce; 
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;

class DashboardMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        // Pastikan relasi user ke mahasiswa diload
        $mahasiswa = $user->mahasiswa;

        if (!$mahasiswa) {
            return redirect()->back()->with('error', 'Data mahasiswa tidak ditemukan.');
        }

        $idMahasiswa = $mahasiswa->id_mahasiswa;
        $today = Carbon::now();

        // ---------------------------------------------------------
        // 1. STATISTIK
        // ---------------------------------------------------------
        
        // A. Terdaftar: Hitung berapa enrollment (OSCE) yang diikuti
        $ujianTerdaftar = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)->count();

        // B. Selesai: Hitung enrollment yang sudah memiliki Nilai (via tabel relasi nilai_osce)
        // Asumsi: Jika sudah ada entry di tabel nilai_osce, berarti sudah dinilai/selesai
        $ujianSelesai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->has('nilaiOsce') 
            ->count();

        // C. Rata-rata Nilai (Ambil dari relasi nilaiOsce -> kolom nilai)
        // Kita perlu meloop karena nilainya ada di tabel terpisah
        $totalNilai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->with('nilaiOsce')
            ->get()
            ->pluck('nilaiOsce.nilai') // Ambil kolom 'nilai' dari relasi
            ->avg();

        // ---------------------------------------------------------
        // 2. JADWAL (CORE LOGIC FIX)
        // ---------------------------------------------------------
        
        // Langkah 1: Ambil ID OSCE apa saja yang diikuti mahasiswa ini
        $enrolledOsceIds = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->pluck('id_osce'); // Hasil: [1, 3, 5] misalnya

        // Langkah 2: Base Query
        $baseQuery = OsceStase::with(['osce', 'ruang'])
            ->whereIn('id_osce', $enrolledOsceIds);

        // A. Query Khusus Kalender (Ambil SEMUA tanggal unik untuk dots)
        // Kita clone agar tidak terpengaruh filter di bawah
        // Gunakan get() lalu map() untuk memastikan format tanggal Y-m-d string
        $kalenderEvent = (clone $baseQuery)
            ->get()
            ->pluck('tanggal')
            ->map(function ($date) {
                // Karena ada cast 'date' di model, $date bisa jadi Carbon instance
                return $date instanceof \Carbon\Carbon 
                    ? $date->format('Y-m-d') 
                    : \Carbon\Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->values();

        // B. Query Khusus List Jadwal (Dipengaruhi Filter)
        $listQuery = clone $baseQuery;

        // Filter Tanggal (Jika ada request date dari kalender)
        if ($request->has('date') && $request->date) {
            $listQuery->whereDate('tanggal', $request->date);
        } else {
            // Default: Tampilkan jadwal hari ini ke depan
            $listQuery->whereDate('tanggal', '>=', $today->format('Y-m-d'));
        }

        $rawSchedules = $listQuery->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // ---------------------------------------------------------
        // 3. MAPPING DATA KE FRONTEND
        // ---------------------------------------------------------

        // Jika ada filter tanggal, ambil semua. Jika tidak, ambil 3 terdekat.
        $limit = $request->has('date') ? $rawSchedules->count() : 3;

        $jadwalPenting = $rawSchedules->take($limit)->map(function ($stase) use ($today) {
            $tanggalUjian = Carbon::parse($stase->tanggal);
            $selisihHari = $today->diffInDays($tanggalUjian, false); // false = return negatif jika lewat

            return [
                'id_osce_stase'  => $stase->id_osce_stase,
                'nama_ujian'     => $stase->nama_stase . ' (' . $stase->osce->nama_osce . ')',
                'ruangan'        => $stase->ruang ? $stase->ruang->nomor_ruangan : '-',
                'tanggal_full'   => $tanggalUjian->translatedFormat('l, d F Y'),
                'tanggal_pendek' => $tanggalUjian->format('d M'),
                'jam'            => Carbon::parse($stase->jam_mulai)->format('H:i'),
                'sisa_hari'      => (int) ceil($selisihHari),
                'tipe'           => 'Stase',
            ];
        })->values();

        // ---------------------------------------------------------
        // 5. RETURN
        // ---------------------------------------------------------
        return Inertia::render('Mahasiswa/Dashboard', [
            'statistik' => [
                'terdaftar'   => $ujianTerdaftar,
                'selesai'     => $ujianSelesai,
                'nilai_akhir' => $totalNilai ? round($totalNilai, 2) : 0,
            ],
            'jadwal_penting' => $jadwalPenting,
            'kalender_event' => $kalenderEvent,
            'selected_date'  => $request->date, // Kirim balik tanggal yang dipilih
        ]);
    }
}