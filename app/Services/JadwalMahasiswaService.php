<?php

namespace App\Services;

use App\Models\EnrollmentOsce;
use App\Models\OsceStase;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class JadwalMahasiswaService
{
    public function getCurrentMahasiswaId()
    {
        $user = Auth::user();
        return $user && $user->mahasiswa ? $user->mahasiswa->id_mahasiswa : null;
    }

    /**
     * Mengambil daftar tanggal sesi dari tabel enrollment_osce.
     * Tidak mempedulikan ID OSCE, pokoknya ambil semua tanggal dimana mahasiswa terdaftar.
     */
    public function getEnrollmentDates($idMahasiswa)
    {
        return EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereNotNull('tanggal_sesi') // Pastikan tanggal sudah di-set admin
            ->join('osce', 'enrollment_osce.id_osce', '=', 'osce.id_osce') // Join untuk ambil data OSCE jika perlu sorting/filter tambahan
            ->select('enrollment_osce.tanggal_sesi', 'osce.nama_osce') // Select tanggal
            ->orderBy('enrollment_osce.tanggal_sesi', 'asc')
            ->get()
            ->map(function ($item) {
                $carbonDate = Carbon::parse($item->tanggal_sesi);
                return [
                    'date_raw'    => $carbonDate->format('Y-m-d'),
                    'date_label'  => $carbonDate->translatedFormat('d F Y'), // Tampilan: 13 Desember 2025
                    // Opsional: Jika mau menampilkan nama OSCE di dropdown biar lebih jelas
                    // 'date_label' => $carbonDate->translatedFormat('d F Y') . ' (' . $item->nama_osce . ')', 
                    'is_selected' => false,
                ];
            })
            // Unique berdasarkan tanggal, karena 1 mahasiswa bisa punya 1 row enrollment per ujian
            ->unique('date_raw')
            ->values();
    }

    /**
     * Logic Utama Dinamis:
     * Cari Enrollment berdasarkan Tanggal -> Dapat ID OSCE & Nama OSCE yang benar.
     */
   public function getActiveExamInfo($idMahasiswa, $selectedDate)
    {
        // 1. Cari Enrollment spesifik
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereDate('tanggal_sesi', $selectedDate)
            ->with(['osce', 'osce.osceStase']) 
            ->first();

        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        $osce = $enrollment->osce;
        $timezone = 'Asia/Jakarta';

        // Ambil jam sesi langsung dari enrollment
        // Pastikan formatnya H:i:s agar cocok dengan database
        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '08:00:00'; 
        
        // Parsing jam untuk display (H:i)
        $jamMulaiDisplay = substr($jamMulaiStr, 0, 5);

        // Hitung estimasi selesai
        $totalDurasiMenit = $osce->osceStase->sum('durasi_per_mahasiswa');
        $waktuSelesai = Carbon::parse($jamMulaiStr, $timezone)
            ->addMinutes($totalDurasiMenit)
            ->format('H:i');

        // Buat Target Waktu Countdown
        $targetDateTime = Carbon::parse($selectedDate . ' ' . $jamMulaiStr, $timezone);
        $now = Carbon::now($timezone);

        $isFinished = true;
        $countdownSnapshot = ['days' => '00', 'hours' => '00', 'minutes' => '00', 'seconds' => '00'];

        if ($targetDateTime->greaterThan($now)) {
            $isFinished = false;
            $diff = $targetDateTime->diff($now);
            $countdownSnapshot = [
                'days'    => str_pad($diff->days, 2, '0', STR_PAD_LEFT),
                'hours'   => str_pad($diff->h, 2, '0', STR_PAD_LEFT),
                'minutes' => str_pad($diff->i, 2, '0', STR_PAD_LEFT),
                'seconds' => str_pad($diff->s, 2, '0', STR_PAD_LEFT),
            ];
        }

        return [
            'id_osce'           => $osce->id_osce,
            'jam_sesi_raw'      => $jamMulaiStr, // [PENTING] Ini kunci filternya (misal: 08:00:00)
            'judul'             => $osce->nama_osce,
            'tanggal_formatted' => Carbon::parse($selectedDate)->translatedFormat('d F Y'),
            'waktu_mulai'       => $jamMulaiDisplay,
            'waktu_selesai'     => $waktuSelesai,
            'countdown_target'  => $targetDateTime->toIso8601String(),
            'countdown'         => $countdownSnapshot,
            'is_finished'       => $isFinished,
        ];
    }

    /**
     * Mengambil Tabel Stase
     * [UPDATE] Menambahkan parameter $jamSesi untuk filter
     */
   public function getJadwalStase($idOsce, $selectedDate, $jamSesi = null)
    {
        // 1. Definisikan Waktu
        $timezone = 'Asia/Jakarta';
        $now = Carbon::now($timezone);
        
        // Gabungkan tanggal dan jam sesi untuk dapat waktu mulai absolut
        // Jika $jamSesi null, kita asumsikan 00:00 (tapi seharusnya tidak null dari controller)
        $waktuMulaiUjian = Carbon::parse($selectedDate . ' ' . ($jamSesi ?? '00:00:00'), $timezone);

        // ==========================================================
        // SECURITY CHECK: UJIAN BELUM DIMULAI
        // ==========================================================
        // Jika waktu sekarang KURANG DARI waktu mulai ujian, 
        // Jangan kembalikan data apapun (return kosong).
        // Mahasiswa hanya boleh melihat hitung mundur, bukan isi tabel.
        if ($now->lessThan($waktuMulaiUjian)) {
            return collect([]); // Kembalikan Collection kosong
        }

        // ==========================================================
        // QUERY DATA (Hanya dijalankan jika ujian SUDAH dimulai)
        // ==========================================================
        
        $query = OsceStase::with(['stase', 'ruang', 'penguji.pengguna'])
            ->where('id_osce', $idOsce)
            ->whereDate('tanggal', $selectedDate);

        // Filter Sesi Berdasarkan Jam Mulai
        if ($jamSesi) {
            $query->where('jam_mulai', $jamSesi);
        }

        $query->orderBy('jam_mulai', 'asc');

        // Logic Opsional: Menyembunyikan stase yang sudah lewat jamnya (History)
        // Jika user reload halaman saat ujian berlangsung, stase yg sudah lewat tetap aman disembunyikan
        // atau ditampilkan (tergantung kebijakan). Code di bawah ini menyembunyikan yg lewat.
        /* if (Carbon::parse($selectedDate)->isToday()) {
             $query->whereRaw("CONCAT(?, ' ', jam_selesai) > ?", [$selectedDate, $now->toDateTimeString()]);
        }
        */

        return $query->get();
    }
}