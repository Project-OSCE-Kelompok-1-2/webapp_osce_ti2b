<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class PenggunaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'username' => $this->faker->unique()->userName(),
            'password' => ('password123'),
            'jenis_role' => $this->faker->randomElement(['admin', 'mahasiswa', 'penguji']),
            'path_gambar' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
