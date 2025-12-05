<?php

namespace Database\Factories;

use App\Models\Ruang;
use Illuminate\Database\Eloquent\Factories\Factory;

class RuangFactory extends Factory
{
    protected $model = Ruang::class;

    public function definition(): array
    {
        return [
            'nomor_ruangan' => 'R-' . $this->faker->numerify('###'),
            'lokasi' => 'Gedung ' . $this->faker->randomElement(['A', 'B', 'C']),
        ];
    }
}
