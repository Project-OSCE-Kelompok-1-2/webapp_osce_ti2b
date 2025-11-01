<?php

namespace Database\Factories;

use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Pengguna>
 */
class PenggunaFactory extends Factory
{
    protected $model = Pengguna::class;

    public function definition(): array
    {
        return [
            'username'   => $this->faker->unique()->userName(),
            'password'   => 'password123', // biarkan plain karena sudah di hash di model app/Models/Pengguna.php
            'jenis_role' => $this->faker->randomElement(['admin', 'mahasiswa', 'penguji']),
        ];
    }
}
