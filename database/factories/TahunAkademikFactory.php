<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TahunAkademikFactory extends Factory
{
    public function definition(): array
    {
        $year = $this->faker->numberBetween(2021, 2026);
        return [
            'tahun' => $year . '/' . ($year + 1),
            'semester' => $this->faker->randomElement(['Ganjil', 'Genap']),
            'status' => 'aktif',
            'mulai_input_nilai' => now(),
            'selesai_input_nilai' => now()->addMonth(),
        ];
    }
}
