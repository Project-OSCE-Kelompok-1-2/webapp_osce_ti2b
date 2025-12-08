<?php

namespace App\Services\Mahasiswa;

use Illuminate\Support\Collection;

class NilaiCalculatorService
{
    // Ambang batas (Threshold) nilai minimum untuk dianggap LULUS.
    public const PASSING_THRESHOLD = 75.0;

    /**
     * Menghitung Nilai Akhir untuk Satu Stase (Kompetensi).
     * Menerima Collection data, bukan ID, untuk menghindari query berulang (N+1).
     *
     * @param Collection $poinAspekList Collection dari poin penilaian pada stase tersebut.
     * @return array
     */
    public function calculateFinalGrade(Collection $poinAspekList): array
    {
        if ($poinAspekList->isEmpty()) {
            return [
                'final_score' => 0,
                'predicate'   => 'E (Data Kosong)'
            ];
        }

        // 1. Kelompokkan Data Berdasarkan 'Aspek Penilaian'
        // Karena satu stase bisa terdiri dari beberapa aspek (misal: Anamnesis, Fisik, dll)
        // Kita butuh grouping berdasarkan ID Aspek.
        $groupedByAspek = $poinAspekList->groupBy(function ($item) {
            // Menangani akses properti secara aman
            return $item->aspekPenilaian->id_aspek_penilaian ?? $item->id_aspek_penilaian ?? 'unknown';
        });

        $totalNilaiSemuaAspek = 0;
        $jumlahAspek = $groupedByAspek->count();

        // 2. Hitung Nilai Per Aspek
        foreach ($groupedByAspek as $aspekId => $items) {
            $sumSkorBobot = 0;

            foreach ($items as $item) {
                // Ambil Skor (Inputan Penguji)
                $skor = $item->skor ?? 0;

                // Ambil Bobot (Dari Master Data Aspek)
                // Pastikan akses relationship 'aspekPenilaian' ada
                $bobot = $item->aspekPenilaian->bobot_maksimum ?? $item->bobot ?? 1;

                // Rumus: Skor x Bobot
                $sumSkorBobot += ($skor * $bobot);
            }

            // Rumus Nilai Aspek: Total (Skor x Bobot) / 4
            // (Angka 4 adalah skala maksimum rubrik)
            $nilaiAspek = $sumSkorBobot / 4;
            
            $totalNilaiSemuaAspek += $nilaiAspek;
        }

        // 3. Hitung Rata-rata Nilai Akhir Stase
        // (Total Nilai Semua Aspek / Jumlah Aspek)
        $finalScore = ($jumlahAspek > 0) ? ($totalNilaiSemuaAspek / $jumlahAspek) : 0;
        
        // Pembulatan 2 desimal
        $finalScore = round($finalScore, 2);

        return [
            'final_score' => $finalScore,
            'predicate'   => $this->determinePredikat($finalScore)
        ];
    }

    /**
     * Menghitung Nilai Rata-Rata Keseluruhan (Grand Total) dari semua Stase.
     *
     * @param array $daftarNilai Array hasil kalkulasi per stase (format dari Controller).
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
        $count = count($daftarNilai);

        foreach ($daftarNilai as $nilai) {
            // Mengambil key 'nilai' dari array yang disusun di controller
            $totalScore += $nilai['nilai'] ?? 0;
        }

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
     * Menentukan status LULUS atau TIDAK LULUS.
     */
    protected function determineStatus(float $nilaiAkhir): string
    {
        return ($nilaiAkhir >= self::PASSING_THRESHOLD) ? 'LULUS' : 'TIDAK LULUS';
    }

    /**
     * Menentukan predikat nilai berdasarkan rentang.
     */
    protected function determinePredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir >= 85) {
            return 'Sangat Baik';
        } elseif ($nilaiAkhir >= 75) {
            return 'Baik';
        } elseif ($nilaiAkhir >= 60) {
            return 'Cukup';
        } elseif ($nilaiAkhir >= 40) {
            return 'Kurang';
        } else {
            return 'Sangat Kurang';
        }
    }
}