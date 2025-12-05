<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BlokFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nama_blok' => 'Blok ' . $this->faker->word(),
            'deskripsi' => $this->faker->sentence(),
        ];
    }
}
