<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;

class MahasiswaFactory extends Factory
{
    protected $model = Mahasiswa::class;

    public function definition(): array
    {
        return [
            'id_pengguna' => Pengguna::factory()->state(['jenis_role' => 'mahasiswa']),
            'nama'        => $this->faker->name(),
            'nim'         => $this->faker->unique()->numerify('NIM####'),
            'kelas'       => $this->faker->randomElement(['A', 'B', 'C']),
            'status'      => $this->faker->randomElement(['aktif', 'nonaktif']),
        ];
    }
}
