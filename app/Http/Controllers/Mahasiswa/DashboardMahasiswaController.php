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

        // Langkah 2: Ambil SEMUA Stase yang ID OSCE-nya ada di daftar di atas
        // Logika: Mahasiswa ikut rotasi stase di OSCE yang dia daftar
        $rawSchedules = OsceStase::with(['osce', 'ruang'])
            ->whereIn('id_osce', $enrolledOsceIds) // Filter berdasarkan OSCE yang diikuti
            ->whereDate('tanggal', '>=', $today->format('Y-m-d')) // Hanya jadwal masa depan
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // ---------------------------------------------------------
        // 3. MAPPING DATA KE FRONTEND
        // ---------------------------------------------------------

        $jadwalPenting = $rawSchedules->take(3)->map(function ($stase) use ($today) {
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
        // 4. KALENDER EVENT
        // ---------------------------------------------------------
        $kalenderEvent = $rawSchedules->pluck('tanggal')->unique()->values();

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
        ]);
    }
}