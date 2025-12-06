<?php

namespace Database\Factories;

use App\Models\AspekPenilaian;
use Illuminate\Database\Eloquent\Factories\Factory;

class PoinAspekPenilaianFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_aspek_penilaian' => AspekPenilaian::inRandomOrder()->first()->id_aspek_penilaian ?? AspekPenilaian::factory(),
            'kompetensi' => $this->faker->sentence(),
            'skor' => 4, // Max score standard OSCE
            'bobot' => 5,
        ];
    }
}
