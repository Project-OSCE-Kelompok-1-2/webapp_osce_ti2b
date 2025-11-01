<?php

namespace Database\Factories;

use App\Models\Ruang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories.Factory<\App\Models\Ruang>
 */
class RuangFactory extends Factory
{
    protected $model = Ruang::class;

    public function definition(): array
    {
        return [
            'nomor_ruangan' => fake()->bothify('?###'), // contoh: A101, B202, C303
            'lokasi' => fake()->streetAddress(),
        ];
    }
}