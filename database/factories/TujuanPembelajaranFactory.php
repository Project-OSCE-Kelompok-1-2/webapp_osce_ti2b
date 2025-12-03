<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TujuanPembelajaranFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tujuan' => $this->faker->paragraph(),
        ];
    }
}
