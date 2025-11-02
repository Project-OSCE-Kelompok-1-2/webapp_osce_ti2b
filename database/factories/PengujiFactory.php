<?php

namespace Database\Factories;

use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengujiFactory extends Factory
{
    protected $model = Penguji::class;

    public function definition(): array
    {
        return [
            'id_pengguna' => Pengguna::factory()->state(['jenis_role' => 'penguji']),
            'nama'        => $this->faker->name(),
            'nip'         => $this->faker->unique()->numerify('1980#######'),
        ];
    }
}
