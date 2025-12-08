<?php

namespace App\Services;

use App\Models\NilaiOsce;
use App\Models\PoinAspekPenilaian;
use App\Models\AspekPenilaian;
use Illuminate\Support\Facades\DB;

class NilaiCalculatorService
{
    // Ambang batas (Threshold) nilai minimum untuk dianggap LULUS.
    public const PASSING_THRESHOLD = 75.0;

    /**
     * Menghitung nilai untuk setiap Aspek Penilaian dalam satu Stase/Sesi.
     * Logika: SUM(Skor x Bobot) / 4.
     *
     * @param int $enrollmentOsceId ID Enrollment OSCE yang mewakili Mahasiswa dan Sesi tertentu.
     * @param int $staseId ID Stase yang dinilai.
     * @return array<int, array{nilai_aspek: float, predikat: string}> Array dengan key id_aspek_penilaian.
     */
    public function calculateScorePerAspek(int $enrollmentOsceId, int $staseId): array
    {
        // 1. Ambil semua skor dan bobot, dikelompokkan per Aspek Penilaian
        $rawScores = NilaiOsce::query()
            ->where('id_enrollment_osce', $enrollmentOsceId)
            ->join('poin_aspek_penilaian', 'nilai_osce.id_poin_aspek_penilaian', '=', 'poin_aspek_penilaian.id_poin_aspek_penilaian')
            ->join('aspek_penilaian', 'poin_aspek_penilaian.id_aspek_penilaian', '=', 'aspek_penilaian.id_aspek_penilaian')
            ->where('aspek_penilaian.id_stase', $staseId)
            ->select(
                'aspek_penilaian.id_aspek_penilaian',
                DB::raw('SUM(nilai_osce.nilai * poin_aspek_penilaian.bobot) as total_sum_skor_bobot')
            )
            ->groupBy('aspek_penilaian.id_aspek_penilaian')
            ->get();
        
        $result = [];
        foreach ($rawScores as $score) {
            $totalSum = (float) $score->total_sum_skor_bobot;
            
            // Logika Revisi: Total Sum Skor x Bobot, kemudian dibagi 4
            $nilaiAspek = $totalSum / 4;
            
            $result[$score->id_aspek_penilaian] = [
                'nilai_aspek' => round($nilaiAspek, 2),
                'predikat' => $this->determinePredikat($nilaiAspek)
            ];
        }

        return $result;
    }


    /**
     * Menghitung Nilai Akhir Mahasiswa (Rata-rata dari Nilai Seluruh Aspek).
     *
     * @param int $enrollmentOsceId ID Enrollment OSCE.
     * @param int $staseId ID Stase.
     * @return array
     */
    public function calculateFinalScoreAverage(int $enrollmentOsceId, int $staseId): array
    {
        // Hitung nilai untuk setiap aspek terlebih dahulu
        $scoresPerAspek = $this->calculateScorePerAspek($enrollmentOsceId, $staseId);
        
        if (empty($scoresPerAspek)) {
            return $this->getDefaultResult(false, "Data penilaian per aspek tidak ditemukan.");
        }

        $totalNilaiSemuaAspek = 0;
        $jumlahAspek = count($scoresPerAspek);
        
        // Jumlahkan semua nilai aspek yang sudah dihitung (dibagi 4)
        foreach ($scoresPerAspek as $aspekData) {
            $totalNilaiSemuaAspek += $aspekData['nilai_aspek'];
        }
        
        // Nilai Akhir (Rata-rata): Total Nilai Semua Aspek / Jumlah Aspek
        $nilaiAkhirRataRata = $totalNilaiSemuaAspek / $jumlahAspek;

        // Tentukan Status Kelulusan
        $status = $this->determineStatus($nilaiAkhirRataRata);
        
        return [
            'nilai_akhir_rata_rata' => round($nilaiAkhirRataRata, 2),
            'status' => $status,
            'detail_per_aspek' => $scoresPerAspek, // Opsional: Berikan detail per aspek
            'threshold_lulus' => self::PASSING_THRESHOLD
        ];
    }

    // =========================================================================
    // METODE BANTU
    // =========================================================================

    /**
     * Menentukan status LULUS atau TIDAK LULUS.
     */
    protected function determineStatus(float $nilaiAkhir): string
    {
        return ($nilaiAkhir >= self::PASSING_THRESHOLD) ? 'LULUS' : 'TIDAK LULUS';
    }

    /**
     * Menentukan predikat nilai berdasarkan rentang (untuk nilai per Aspek).
     */
    protected function determinePredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir >= 85) {
            return 'Sangat Baik';
        } elseif ($nilaiAkhir >= 75) {
            return 'Baik';
        } elseif ($nilaiAkhir >= 50) {
            return 'Cukup';
        } else {
            return 'Kurang';
        }
    }

    /**
     * Mengembalikan hasil default jika ada kesalahan data.
     */
    protected function getDefaultResult(bool $lulus, string $detail): array
    {
        return [
            'nilai_akhir_rata_rata' => 0.00,
            'status' => $lulus ? 'LULUS' : 'TIDAK LULUS',
            'detail_per_aspek' => [],
            'detail' => $detail,
            'threshold_lulus' => self::PASSING_THRESHOLD
        ];
    }
}