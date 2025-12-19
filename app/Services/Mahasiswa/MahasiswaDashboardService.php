<?php

namespace App\Services\Mahasiswa;

use Carbon\Carbon;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Collection;

class MahasiswaDashboardService
{
    /**
     * Mengambil statistik ujian (Terdaftar, Selesai, Rata-rata Nilai)
     */
    public function getStatistik(int $idMahasiswa): array
    {
        $ujianTerdaftar = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)->count();

        $ujianSelesai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->has('nilaiOsce')
            ->count();

        $rataRataNilai = $this->calculateAverageScore($idMahasiswa);

        return [
            'terdaftar'   => $ujianTerdaftar,
            'selesai'     => $ujianSelesai,
            'nilai_akhir' => $rataRataNilai,
        ];
    }

    /**
     * Logika kompleks perhitungan nilai rata-rata
     */
    private function calculateAverageScore(int $idMahasiswa): float
    {
        $enrollments = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('nilaiOsce')
            ->with([
                'nilaiOsce.poinAspekPenilaian.aspekPenilaian.stase'
            ])
            ->get();

        $kumpulanNilaiStase = [];

        foreach ($enrollments as $enrollment) {
            $nilaiPerStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
                return $nilai->poinAspekPenilaian
                    ?->aspekPenilaian
                    ?->id_stase ?? null;
            });

            $nilaiPerStase = $nilaiPerStase->filter(function ($group, $key) {
                return $key !== null;
            });

            foreach ($nilaiPerStase as $idStase => $nilaiStase) {
                $totalSigmaStase = 0;

                foreach ($nilaiStase as $dataNilai) {
                    $skor = $dataNilai->nilai ?? 0;
                    $bobot = $dataNilai->poinAspekPenilaian->bobot ?? 0;
                    $totalSigmaStase += ($skor * $bobot);
                }

                $nilaiAkhirStase = $totalSigmaStase / 4;
                $nilaiAkhirStase = min($nilaiAkhirStase, 100);

                $kumpulanNilaiStase[] = $nilaiAkhirStase;
            }
        }

        return count($kumpulanNilaiStase) > 0
            ? round(collect($kumpulanNilaiStase)->avg(), 2)
            : 0;
    }

    /**
     * Mengambil daftar tanggal unik untuk dots di kalender
     */
    public function getCalendarEvents(int $idMahasiswa): array
    {
        $enrolledOsceIds = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->pluck('id_osce');

        return OsceStase::whereIn('id_osce', $enrolledOsceIds)
            ->pluck('tanggal')
            ->map(function ($date) {
                return $date instanceof Carbon
                    ? $date->format('Y-m-d')
                    : Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Mengambil list jadwal penting (upcoming atau by date)
     */
    public function getJadwalPenting(int $idMahasiswa, ?string $filterDate = null): Collection
    {
        $enrolledOsceIds = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->pluck('id_osce');

        $query = OsceStase::with(['osce', 'ruang'])
            ->whereIn('id_osce', $enrolledOsceIds);

        $today = Carbon::now();

        if ($filterDate) {
            $query->whereDate('tanggal', $filterDate);
        } else {
            $query->whereDate('tanggal', '>=', $today->format('Y-m-d'));
        }

        $rawSchedules = $query->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        $limit = $filterDate ? $rawSchedules->count() : 3;

        return $rawSchedules->take($limit)->map(function ($stase) use ($today) {
            $tanggalUjian = Carbon::parse($stase->tanggal);
            $selisihHari = $today->diffInDays($tanggalUjian, false);

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
    }
}
