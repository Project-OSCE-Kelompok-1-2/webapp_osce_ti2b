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
        return $user && $user->mahasiswa ? $user->mahasiswa->id_mahasiswa : null;
    }

    /**
     * Mendapatkan List Tanggal Ujian yang diikuti Mahasiswa
     */
    public function getEnrollmentDates($idMahasiswa)
    {
        return EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osce', function ($q) {
                $q->whereDate('tanggal_selesai', '>=', Carbon::now()->startOfDay());
            })
            ->get()
            ->map(function ($enrollment) {
                $tanggalObj = $enrollment->tanggal_sesi
                    ? Carbon::parse($enrollment->tanggal_sesi)
                    : optional($enrollment->osce)->tanggal_mulai;

                if (!$tanggalObj) return null;

                $carbonDate = Carbon::parse($tanggalObj);

                return [
                    'date_raw'    => $carbonDate->format('Y-m-d'),
                    'date_label'  => $carbonDate->translatedFormat('d F Y'),
                    'is_selected' => false,
                ];
            })
            ->filter()
            ->unique('date_raw')
            ->values()
            ->sortBy('date_raw')
            ->values();
    }

    /**
     * Mengambil Data Header (Info Ujian Aktif & Countdown)
     */
    public function getActiveExamInfo($idMahasiswa, $selectedDate = null)
    {
        $query = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osce', function ($q) {
                $q->whereDate('tanggal_selesai', '>=', Carbon::now()->startOfDay());
            })
            ->with(['osce.osceStase']);

        if ($selectedDate) {
            $query->whereDate('tanggal_sesi', $selectedDate);
        }

        $enrollment = $query->first();

        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        $osce = $enrollment->osce;

        // --- PENTING: SETTING TIMEZONE ---
        $timezone = 'Asia/Jakarta'; // Paksa ke WIB

        // 1. Ambil Jam Mulai (String)
        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '08:00:00';
        $jamMulai = substr($jamMulaiStr, 0, 5);

        // 2. Hitung Waktu Selesai (Hanya untuk display)
        $totalDurasiMenit = $osce->osceStase->sum('durasi_per_mahasiswa');
        $waktuSelesai = Carbon::parse($jamMulaiStr, $timezone)
            ->addMinutes($totalDurasiMenit)
            ->format('H:i');

        // 3. Tentukan Tanggal Fix
        $tanggalRaw = $enrollment->tanggal_sesi ?? $osce->tanggal_mulai;
        // Parse tanggal dengan timezone yang benar
        $tanggalObj = Carbon::parse($tanggalRaw)->timezone($timezone);

        // 4. Buat Target Waktu Lengkap (Tanggal + Jam + Timezone)
        // Format Y-m-d H:i:s dibutuhkan agar Carbon bisa membuat objek waktu yang akurat
        $targetDateTime = Carbon::createFromFormat(
            'Y-m-d H:i:s',
            $tanggalObj->format('Y-m-d') . ' ' . $jamMulaiStr,
            $timezone
        );

        $now = Carbon::now($timezone);

        // 5. Hitung status awal
        $isFinished = true;
        $countdownSnapshot = [
            'days' => 0,
            'hours' => 0,
            'minutes' => 0,
            'seconds' => 0
        ];

        if ($targetDateTime->greaterThan($now)) {
            $isFinished = false;
            // Snapshot awal (untuk SSR/Render pertama sebelum JS jalan)
            $diff = $targetDateTime->diff($now);
            $countdownSnapshot = [
                'days'    => $diff->days,
                'hours'   => $diff->h,
                'minutes' => $diff->i,
                'seconds' => $diff->s,
            ];
        }

        return [
            'id_osce'           => $osce->id_osce,
            'judul'             => $osce->nama_osce,
            'tanggal_formatted' => $tanggalObj->translatedFormat('d F Y'),
            'waktu_mulai'       => $jamMulai,
            'waktu_selesai'     => $waktuSelesai,
            // PENTING: Kirim format ISO 8601 (e.g., 2025-12-14T08:00:00+07:00)
            // Ini kunci agar React tahu persis kapan waktu targetnya
            'countdown_target'  => $targetDateTime->toIso8601String(),
            'countdown'         => $countdownSnapshot,
            'is_finished'       => $isFinished,
        ];
    }

    /**
     * Mengambil List Jadwal Per Stase
     */
    public function getJadwalStase($idOsce, $selectedDate)
    {
        $query = OsceStase::with(['stase', 'ruang', 'penguji.pengguna'])
            ->where('id_osce', $idOsce)
            ->orderBy('jam_mulai', 'asc');

        $now = Carbon::now();
        $targetDate = Carbon::parse($selectedDate);

        // Logika filter: Hanya tampilkan jika waktu stase SUDAH LEWAT
        if ($targetDate->isToday()) {
            $query->whereRaw("CONCAT(?, ' ', jam_selesai) < ?", [$targetDate->toDateString(), $now->toDateTimeString()]);
        } else if ($targetDate->lessThan($now->startOfDay())) {
            // Tanggal kemarin/lampau: Tampilkan semua
        } else {
            // Tanggal masa depan: Jangan tampilkan apapun (karena belum lewat)
            $query->whereRaw('1 = 0');
        }

        return $query->get();
    }
}
