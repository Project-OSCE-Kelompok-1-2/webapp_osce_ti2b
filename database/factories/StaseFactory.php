<?php

namespace Database\Factories;

use App\Models\MataKuliah;
use Illuminate\Database\Eloquent\Factories\Factory;

class StaseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_mata_kuliah' => MataKuliah::inRandomOrder()->first()->id_mata_kuliah ?? MataKuliah::factory(),
            'nama_stase' => 'Stase ' . $this->faker->word(),
            'deskripsi' => $this->faker->sentence(),
        ];
    }
}
