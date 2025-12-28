<?php

namespace App\Services\Mahasiswa;

use Illuminate\Support\Collection;

class NilaiCalculatorService
{
    public const PASSING_THRESHOLD = 75.0;

    /**
     * @param Collection $nilaiOsceList Collection dari NilaiOsce untuk satu stase
     * @return array
     */
    public function calculateFinalGrade(Collection $nilaiOsceList): array
    {
        if ($nilaiOsceList->isEmpty()) {
            return [
                'final_score' => 0,
                'predicate'   => 'Belum Dinilai'
            ];
        }

        $totalSkorBobot = 0;

        foreach ($nilaiOsceList as $nilai) {
            $skor = $nilai->nilai ?? 0;

            $bobot = $nilai->poinAspekPenilaian?->bobot ?? 0;

            $totalSkorBobot += ($skor * $bobot);
        }

        $finalScore = $totalSkorBobot / 4;

        $finalScore = round($finalScore, 2);

        $finalScore = min($finalScore, 100);

        return [
            'final_score' => $finalScore,
            'predicate'   => $this->determinePredikat($finalScore)
        ];
    }

    /**
     * @param array $daftarNilai Array hasil kalkulasi per stase (format dari Controller)
     * @return array
     */
    public function calculateOverallResult(array $daftarNilai): array
    {
        if (empty($daftarNilai)) {
            return [
                'overall_score' => 0,
                'status'        => 'BELUM DINILAI'
            ];
        }

        $totalScore = 0;
        $count = 0;

        foreach ($daftarNilai as $nilai) {
            $nilaiStase = $nilai['nilai'] ?? 0;

            if ($nilaiStase > 0) {
                $totalScore += $nilaiStase;
                $count++;
            }
        }

        $avgScore = ($count > 0) ? ($totalScore / $count) : 0;
        $avgScore = round($avgScore, 2);

        return [
            'overall_score' => $avgScore,
            'status'        => $this->determineStatus($avgScore)
        ];
    }

    /**
     * Menentukan status LULUS atau TIDAK LULUS
     */
    protected function determineStatus(float $nilaiAkhir): string
    {
        if ($nilaiAkhir == 0) {
            return 'BELUM LENGKAP';
        }
        return ($nilaiAkhir >= self::PASSING_THRESHOLD) ? 'LULUS' : 'TIDAK LULUS';
    }

    /**
     * Menentukan predikat nilai berdasarkan rentang
     */
    protected function determinePredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir == 0) {
            return 'Belum Dinilai';
        } elseif ($nilaiAkhir >= 85) {
            return 'Sangat Baik';
        } elseif ($nilaiAkhir >= 75) {
            return 'Baik';
        } elseif ($nilaiAkhir >= 60) {
            return 'Cukup';
        } elseif ($nilaiAkhir >= 40) {
            return 'Kurang';
        } else {
            return 'Buruk';
        }
    }
}
