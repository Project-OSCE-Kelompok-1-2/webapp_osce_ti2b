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

        // LOGIKA WAKTU:
        // Prioritas 1: Ambil dari 'jam_sesi' di tabel EnrollmentOsce (Jadwal Spesifik)
        // Prioritas 2: Ambil dari 'tanggal_mulai' di tabel Osce (Jadwal Global)
        // untuk jam_sesi
        $jamMulai = $enrollment->jam_sesi ? substr($enrollment->jam_sesi, 0, 5) : Carbon::parse($osce->tanggal_mulai)->format('H:i');
        
        // Prioritas Tanggal
        $tanggalFix = $enrollment->tanggal_sesi 
            ? Carbon::parse($enrollment->tanggal_sesi) 
            : Carbon::parse($osce->tanggal_mulai);

        return [
            'id_osce' => $osce->id_osce, //
            'judul' => $osce->nama_osce,
            'tanggal_formatted' => $tanggalFix->translatedFormat('d F Y'),
            'waktu_mulai' => $jamMulai,
            'waktu_selesai' => Carbon::parse($osce->tanggal_selesai)->format('H:i'),
            // Target countdown: YYYY-MM-DD HH:mm:ss
            'countdown_target' => $tanggalFix->format('Y-m-d') . ' ' . $jamMulai . ':00',
        ];
    }

    /**
     * Mengambil List Stase (Tabel) untuk Ujian tersebut
     */
    public function getJadwalStase($idOsce)
    {
        // Mengambil semua stase yang dikonfigurasi untuk ujian ini via OsceStase
        // relasi ke 'stase', 'ruang', 'penguji'
        return OsceStase::with(['stase', 'ruang', 'penguji.pengguna']) 
            ->where('id_osce', $idOsce)
            ->orderBy('jam_mulai', 'asc')
            ->paginate(5);
    }
}