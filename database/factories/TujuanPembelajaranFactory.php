<?php

namespace Database\Factories;

use App\Models\Stase;
use Illuminate\Database\Eloquent\Factories\Factory;

class TujuanPembelajaranFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_stase' => Stase::factory(),
            'tujuan' => $this->faker->paragraph(),
        ];
    }
}
