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
     */
    public function getEnrollmentDates($idMahasiswa)
    {
        return EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereNotNull('tanggal_sesi')
            ->join('osce', 'enrollment_osce.id_osce', '=', 'osce.id_osce') 
            ->select('enrollment_osce.tanggal_sesi', 'osce.nama_osce')
            ->orderBy('enrollment_osce.tanggal_sesi', 'asc')
            ->get()
            ->map(function ($item) {
                $carbonDate = Carbon::parse($item->tanggal_sesi);
                return [
                    'date_raw'    => $carbonDate->format('Y-m-d'),
                    'date_label'  => $carbonDate->translatedFormat('d F Y'), 
                    'is_selected' => false,
                ];
            })
            ->unique('date_raw')
            ->values();
    }

    /**
     * Logic Utama:
     */
   public function getActiveExamInfo($idMahasiswa, $selectedDate)
    {
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereDate('tanggal_sesi', $selectedDate)
            ->with(['osce', 'osce.osceStase']) 
            ->first();

        if (!$enrollment || !$enrollment->osce) {
            return null;
        }

        $osce = $enrollment->osce;
        $timezone = 'Asia/Jakarta';

        $jamMulaiStr = $enrollment->jam_sesi ? $enrollment->jam_sesi : '08:00:00'; 
        
        $jamMulaiDisplay = substr($jamMulaiStr, 0, 5);

        $totalDurasiMenit = $osce->osceStase->sum('durasi_per_mahasiswa');
        $waktuSelesai = Carbon::parse($jamMulaiStr, $timezone)
            ->addMinutes($totalDurasiMenit)
            ->format('H:i');

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
            'jam_sesi_raw'      => $jamMulaiStr,
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
     */
   public function getJadwalStase($idOsce, $selectedDate, $jamSesi = null)
    {
        $timezone = 'Asia/Jakarta';
        $now = Carbon::now($timezone);
        
        $waktuMulaiUjian = Carbon::parse($selectedDate . ' ' . ($jamSesi ?? '00:00:00'), $timezone);

        if ($now->lessThan($waktuMulaiUjian)) {
            return collect([]);
        }
        
        $query = OsceStase::with(['stase', 'ruang', 'penguji.pengguna'])
            ->where('id_osce', $idOsce)
            ->whereDate('tanggal', $selectedDate);

        if ($jamSesi) {
            $query->where('jam_mulai', $jamSesi);
        }

        $query->orderBy('jam_mulai', 'asc');

        return $query->get();
    }
}