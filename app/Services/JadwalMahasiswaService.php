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
        // 1. Cari Enrollment spesifik milik user pada tanggal tersebut
        // Ini akan otomatis menemukan Enrollment ID 9 (OSCE 2) jika tanggalnya 2025-12-08
        // Atau Enrollment ID 1 (OSCE 1) jika tanggalnya 2025-12-13
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereDate('tanggal_sesi', $selectedDate)
            ->with(['osce', 'osce.osceStase']) // Load relasi OSCE
            ->first();

        // Validasi: Jika tidak ada jadwal di tanggal itu
        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        // 2. Ambil Data OSCE dari hasil pencarian di atas
        $osce = $enrollment->osce;

        // --- Mulai Hitung Waktu & Countdown ---
        $timezone = 'Asia/Jakarta';

        // Ambil jam sesi langsung dari enrollment (sesuai ERD dan screenshot)
        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '08:00:00';
        $jamMulai = substr($jamMulaiStr, 0, 5);

        // Hitung estimasi selesai berdasarkan jumlah durasi stase di OSCE tersebut
        $totalDurasiMenit = $osce->osceStase->sum('durasi_per_mahasiswa');
        $waktuSelesai = Carbon::parse($jamMulaiStr, $timezone)
            ->addMinutes($totalDurasiMenit)
            ->format('H:i');

        // Buat Target Waktu untuk Countdown
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
            'id_osce'           => $osce->id_osce,   // ID OSCE Dinamis
            'judul'             => $osce->nama_osce, // Nama OSCE Dinamis
            'tanggal_formatted' => Carbon::parse($selectedDate)->translatedFormat('d F Y'),
            'waktu_mulai'       => $jamMulai,
            'waktu_selesai'     => $waktuSelesai,
            'countdown_target'  => $targetDateTime->toIso8601String(),
            'countdown'         => $countdownSnapshot,
            'is_finished'       => $isFinished,
        ];
    }

    /**
     * Mengambil Tabel Stase
     * Menggunakan ID OSCE yang didapat dari fungsi getActiveExamInfo sebelumnya
     */
    public function getJadwalStase($idOsce, $selectedDate)
    {
        // Ambil stase-stase yang milik ID OSCE tersebut
        // Relasi: osce_stase -> fk id_osce
        $query = OsceStase::with(['stase', 'ruang', 'penguji.pengguna'])
            ->where('id_osce', $idOsce)
            // Pastikan stase yang diambil adalah stase yang dijadwalkan pada tanggal/jam sesi tersebut
            // Sesuai ERD, osce_stase juga punya kolom 'tanggal' dan 'jam_mulai'
            // Kita harus mencocokkan tanggal stase dengan tanggal sesi yang dipilih mahasiswa
            ->whereDate('tanggal', $selectedDate)
            ->orderBy('jam_mulai', 'asc');

        $now = Carbon::now();
        $targetDate = Carbon::parse($selectedDate);

        // Logic Filter History (Sama seperti sebelumnya)
        if ($targetDate->isToday()) {
            // Jika hari ini, sembunyikan yang sudah lewat jamnya
            $query->whereRaw("CONCAT(?, ' ', jam_selesai) < ?", [$targetDate->toDateString(), $now->toDateTimeString()]);
        } else if ($targetDate->gt($now->startOfDay())) {
            // Jika tanggal masa depan, jangan tampilkan tabelnya (belum mulai)
            // Atau bisa dihilangkan else ini jika ingin tetap menampilkan rundown jadwal masa depan
            $query->whereRaw('1 = 0');
        }

        return $query->get();
    }
}
