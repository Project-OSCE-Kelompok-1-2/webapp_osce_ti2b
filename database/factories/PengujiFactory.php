<?php

namespace Database\Factories;

use App\Models\Pengguna;
use App\Models\Penguji;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengujiFactory extends Factory
{
    protected $model = Penguji::class;

    public function definition(): array
    {
        $gelarDepan = $this->faker->randomElement(['dr.', 'Dr. dr.', 'Prof. dr.']);
        $gelarBelakang = $this->faker->randomElement(['Sp.PD', 'Sp.A', 'Sp.B', 'Sp.JP', 'Sp.S', 'M.Kes', 'Ph.D']);

        return [
            'id_pengguna' => Pengguna::factory()->state(['jenis_role' => 'penguji']),
            'nama' => $gelarDepan . ' ' . $this->faker->firstName() . ' ' . $this->faker->lastName() . ', ' . $gelarBelakang,
            'nip' => $this->faker->unique()->numerify('19##########'), // Format NIP
        ];
    }
}
