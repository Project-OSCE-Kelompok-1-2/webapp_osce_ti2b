<?php

namespace App\Services\Mahasiswa;

use Carbon\Carbon;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;

class JadwalMahasiswaService
{
    /**
     * Helper untuk mendapatkan ID Mahasiswa dari user yang login
     */
    public function getCurrentMahasiswaId()
    {
        $user = Auth::user();
        return $user->mahasiswa ? $user->mahasiswa->id_mahasiswa : null;
    }

    public function getEnrollmentDates(int $idMahasiswa)
    {
        $enrollments = EnrollmentOsce::with(['osce.osceStase'])
            ->where('id_mahasiswa', $idMahasiswa)
            ->get();

        $dates = collect();

        foreach ($enrollments as $enrollment) {
            if ($enrollment->osce && $enrollment->osce->osceStase) {
                $osceDates = $enrollment->osce->osceStase
                    ->pluck('tanggal')
                    ->map(function ($date) {
                        return Carbon::parse($date)->format('Y-m-d');
                    })
                    ->unique();

                foreach ($osceDates as $date) {
                    $carbonDate = Carbon::parse($date);
                    $dates->push([
                        'date_raw'      => $date, 
                        'date_human'    => $carbonDate->translatedFormat('l, d F Y'), 
                        'nama_osce'     => $enrollment->osce->nama_osce,
                        'is_selected'   => false 
                    ]);
                }
            }
        }

        return $dates->unique('date_raw')->sortBy('date_raw')->values();
    }

    /**
     * Ambil Header Informasi Ujian (Nama OSCE, Sesi) berdasarkan tanggal
     */
    public function getExamHeader(int $idMahasiswa, string $date)
    {
        $enrollment = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osce.osceStase', function ($q) use ($date) {
                $q->whereDate('tanggal', $date);
            })
            ->with(['osce'])
            ->first();

        if (!$enrollment) return null;

        $firstStase = OsceStase::where('id_osce', $enrollment->id_osce)
            ->whereDate('tanggal', $date)
            ->orderBy('jam_mulai', 'asc')
            ->first();

        return [
            'id_osce'       => $enrollment->id_osce,
            'nama_osce'     => $enrollment->osce->nama_osce,
            'tanggal'       => Carbon::parse($date)->translatedFormat('l, d F Y'),
            'jam_sesi_raw'  => $firstStase ? $firstStase->jam_mulai : '00:00:00',
            'jam_sesi'      => $firstStase ? Carbon::parse($firstStase->jam_mulai)->format('H:i') . ' WIB' : '-',
        ];
    }

    /**
     * Ambil Detail Jadwal Stase (Ruangan, Penguji, Waktu)
     */
    public function getJadwalStaseDetail(int $idOsce, string $date)
    {
        $schedules = OsceStase::with(['stase', 'ruang', 'penguji'])
            ->where('id_osce', $idOsce)
            ->whereDate('tanggal', $date)
            ->orderBy('jam_mulai', 'asc')
            ->get();

        return $schedules->map(function ($item) {
            $namaPenguji = $item->penguji ? $item->penguji->nama : '-';

            $namaRuangan = '-';
            if ($item->ruang) {
                $nomor = $item->ruang->nomor_ruangan;
                $lokasi = $item->ruang->lokasi;
                $namaRuangan = !empty($lokasi) ? "$nomor - $lokasi" : $nomor;
            }

            $jamMulai = substr($item->jam_mulai, 0, 5);
            $jamSelesai = substr($item->jam_selesai, 0, 5);

            return [
                'id_osce_stase'      => $item->id_osce_stase,
                'stase_keterampilan' => $item->stase->nama_stase ?? 'Stase Tanpa Nama',
                'waktu'              => "$jamMulai - $jamSelesai WIB",
                'jam_mulai_raw'      => $jamMulai,
                'ruangan'            => $namaRuangan,
                'penguji'            => $namaPenguji,
            ];
        });
    }
}
