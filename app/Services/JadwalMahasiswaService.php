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
        // Mengakses relasi 'mahasiswa' dari model Pengguna
        return $user && $user->mahasiswa ? $user->mahasiswa->id_mahasiswa : null;
    }

    /**
     * Mengambil Data Header (Ujian Aktif Mahasiswa)
     */
    public function getActiveExamInfo($idMahasiswa)
    {
        // Cari enrollment dimana ujiannya belum lewat (tanggal_selesai >= hari ini)
        //
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osce', function ($q) {
                $q->whereDate('tanggal_selesai', '>=', Carbon::now());
            })
            ->with('osce')
            ->first();
        
        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        $osce = $enrollment->osce;

        // Hitung waktu mulai
        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '00:00:00';
        $jamMulai = substr($jamMulaiStr, 0, 5);

        // Hitung durasi total dari semua stase (dalam menit)
        $totalDurasi = $osce->osceStase->sum('durasi_per_mahasiswa');

        // Hitung waktu selesai
        $waktuSelesai = Carbon::parse($jamMulaiStr)->addMinutes($totalDurasi)->format('H:i');
        
        $tanggalFix = $enrollment->tanggal_sesi 
            ? Carbon::parse($enrollment->tanggal_sesi) 
            : Carbon::parse($osce->tanggal_mulai);

        return [
            'id_osce' => $osce->id_osce,
            'judul' => $osce->nama_osce,
            'tanggal_formatted' => $tanggalFix->translatedFormat('d F Y'),
            'waktu_mulai' => $jamMulai,
            'waktu_selesai' => $waktuSelesai,
            'countdown_target' => $tanggalFix->format('Y-m-d') . ' ' . $jamMulai . ':00',
        ];
    }

    public function getJadwalStase($idOsce)
    {
        return OsceStase::with(['stase', 'ruang', 'penguji.pengguna']) 
            ->where('id_osce', $idOsce)
            ->orderBy('jam_mulai', 'asc')
            ->paginate(5);
    }
}