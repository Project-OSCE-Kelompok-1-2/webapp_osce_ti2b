<?php

namespace Database\Factories;

use App\Models\Blok;
use App\Models\Enrollment;
use Illuminate\Database\Eloquent\Factories\Factory;

class MataKuliahFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_blok' => Blok::inRandomOrder()->first()->id_blok ?? Blok::factory(),
            'id_enrollment' => Enrollment::inRandomOrder()->first()->id_enrollment ?? Enrollment::factory(),
            'nama_mata_kuliah' => 'MK ' . $this->faker->words(3, true),
            'deskripsi' => $this->faker->sentence(),
        ];
    }
}
