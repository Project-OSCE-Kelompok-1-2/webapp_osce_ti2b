<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TahunAkademik>
 */
class TahunAkademikFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Contoh: Tahun akademik 2024/2025, semester ganjil/genap
        $tahunMulai = $this->faker->numberBetween(2020, 2025);
        $tahunSelesai = $tahunMulai + 1;
        $semester = $this->faker->randomElement(['Ganjil', 'Genap']);

        // Rentang tanggal input nilai
        $mulai = $this->faker->dateTimeBetween('-1 month', 'now');
        $selesai = (clone $mulai)->modify('+1 month');

        return [
            'tahun' => "{$tahunMulai}/{$tahunSelesai}",
            'semester' => $semester,
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'mulai_input_nilai' => $mulai,
            'selesai_input_nilai' => $selesai,
        ];
    }
}
