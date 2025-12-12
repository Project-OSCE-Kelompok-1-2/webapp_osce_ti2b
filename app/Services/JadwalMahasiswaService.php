<?php

namespace App\Services;

use App\Models\EnrollmentOsce;
use App\Models\OsceStase;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class JadwalMahasiswaService
{
    /**
     * Mendapatkan ID Mahasiswa dari User Login
     */
    public function getCurrentMahasiswaId()
    {
        $user = Auth::user();
        // Pastikan relasi 'mahasiswa' ada di model User/Pengguna
        return $user && $user->mahasiswa ? $user->mahasiswa->id_mahasiswa : null;
    }

    /**
     * Mengambil Data Header (Info Ujian Aktif & Countdown)
     */
    public function getActiveExamInfo($idMahasiswa)
    {
        // 1. Cari Enrollment Mahasiswa pada OSCE yang masih aktif (belum lewat tanggal selesai)
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osce', function ($q) {
                // Asumsi: Ujian aktif jika tanggal selesai >= hari ini
                $q->whereDate('tanggal_selesai', '>=', Carbon::now());
            })
            ->with(['osce.osceStase']) // Eager load stase untuk hitung durasi
            ->first();
        
        // Jika tidak ada jadwal ujian aktif
        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        $osce = $enrollment->osce;

        // 2. Hitung Waktu Mulai (Ambil dari sesi enrollment atau default 08:00)
        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '08:00:00';
        $jamMulai = substr($jamMulaiStr, 0, 5); // Ambil HH:mm

        // 3. Hitung Waktu Selesai (Jam Mulai + Total Durasi Semua Stase)
        $totalDurasiMenit = $osce->osceStase->sum('durasi_per_mahasiswa');
        $waktuSelesai = Carbon::parse($jamMulaiStr)->addMinutes($totalDurasiMenit)->format('H:i');
        
        // 4. Tentukan Tanggal Fix (Prioritas: Tanggal Sesi Enrollment -> Tanggal Mulai OSCE)
        $tanggalObj = $enrollment->tanggal_sesi 
            ? Carbon::parse($enrollment->tanggal_sesi) 
            : Carbon::parse($osce->tanggal_mulai);

        // 5. Return Data Header Sesuai Props React 'examHeader'
        return [
            'id_osce'           => $osce->id_osce,
            'judul'             => $osce->nama_osce,
            'tanggal_formatted' => $tanggalObj->translatedFormat('d F Y'), // Contoh: 10 Desember 2025
            'waktu_mulai'       => $jamMulai,
            'waktu_selesai'     => $waktuSelesai,
            // Format Countdown untuk JS: 'YYYY-MM-DD HH:mm:ss'
            'countdown_target'  => $tanggalObj->format('Y-m-d') . ' ' . $jamMulai . ':00',
        ];
    }

    /**
     * Mengambil List Jadwal Per Stase (Tabel)
     */
    public function getJadwalStase($idOsce)
    {
        return OsceStase::with(['stase', 'ruang', 'penguji.pengguna']) 
            ->where('id_osce', $idOsce)
            ->orderBy('jam_mulai', 'asc')
            ->get(); // [PENTING] Ganti paginate() menjadi get()
    }
}