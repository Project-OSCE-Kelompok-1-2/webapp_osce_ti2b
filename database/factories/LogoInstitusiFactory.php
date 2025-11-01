<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LogoInstitusi>
 */
class LogoInstitusiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Membuat data dummy institusi dengan logo dan deskripsi
        return [
            'nama_institusi' => $this->faker->company(), // Nama universitas/institusi
            'path_logo' => 'storage/logos/' . $this->faker->word() . '.png', // Path logo
            'deskripsi' => $this->faker->sentence(8), // Deskripsi singkat institusi
        ];
    }
}
