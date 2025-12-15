<?php

namespace App\Services\Mahasiswa;

use Illuminate\Support\Collection;

class NilaiCalculatorService
{
    // Ambang batas (Threshold) nilai minimum untuk dianggap LULUS
    public const PASSING_THRESHOLD = 75.0;

    /**
     * Menghitung Nilai Akhir untuk Satu Stase.
     * 
     * LOGIKA PERHITUNGAN:
     * 1. Setiap stase punya banyak poin aspek penilaian
     * 2. Setiap poin punya: skor (dari penguji, range 0-4) dan bobot (dari master data)
     * 3. Rumus: Σ(skor × bobot) / 4 = Nilai Stase (maksimal 100)
     * 
     * Contoh:
     * - Poin 1: skor=3, bobot=10 → 3×10 = 30
     * - Poin 2: skor=4, bobot=8  → 4×8  = 32
     * - Poin 3: skor=2, bobot=12 → 2×12 = 24
     * Total = 86
     * Nilai Akhir = 86 / 4 = 21.5
     * 
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

        // Iterasi setiap nilai yang ada di stase ini
        foreach ($nilaiOsceList as $nilai) {
            // Ambil skor dari tabel nilai_osce (skor yang dicentang penguji, 0-4)
            $skor = $nilai->nilai ?? 0;

            // Ambil bobot dari poin_aspek_penilaian
            $bobot = $nilai->poinAspekPenilaian?->bobot ?? 0;

            // Kalikan skor × bobot
            $totalSkorBobot += ($skor * $bobot);
        }

        // Bagi dengan 4 (skala maksimal rubrik) untuk mendapat nilai 0-100
        $finalScore = $totalSkorBobot / 4;

        // Pembulatan 2 desimal
        $finalScore = round($finalScore, 2);

        // Pastikan tidak melebihi 100
        $finalScore = min($finalScore, 100);

        return [
            'final_score' => $finalScore,
            'predicate'   => $this->determinePredikat($finalScore)
        ];
    }

    /**
     * Menghitung Nilai Rata-Rata Keseluruhan (Grand Total) dari semua Stase.
     *
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

            // Hanya hitung stase yang sudah dinilai (nilai > 0)
            if ($nilaiStase > 0) {
                $totalScore += $nilaiStase;
                $count++;
            }
        }

        // Hitung rata-rata
        $avgScore = ($count > 0) ? ($totalScore / $count) : 0;
        $avgScore = round($avgScore, 2);

        return [
            'overall_score' => $avgScore,
            'status'        => $this->determineStatus($avgScore)
        ];
    }

    // =========================================================================
    // METODE BANTU (HELPER)
    // =========================================================================

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
