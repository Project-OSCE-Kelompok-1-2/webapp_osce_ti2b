<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AspekPenilaian; // <-- Import model induknya

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PoinAspekPenilaian>
 */
class PoinAspekPenilaianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Sesuai ERD & Migrasi: id_aspek_penilaian (Foreign Key)
            // Panggil factory AspekPenilaian
            'id_aspek_penilaian' => AspekPenilaian::factory(),

            // Sesuai ERD & Migrasi: kompetensi (text)
            'kompetensi' => $this->faker->paragraph(2), // Membuat paragraf palsu (2 kalimat)

            // Sesuai ERD & Migrasi: skor (integer)
            'skor' => $this->faker->numberBetween(0, 4), // Angka acak antara 0-4

            // Sesuai ERD & Migrasi: bobot (integer)
            'bobot' => $this->faker->numberBetween(1, 50), // Angka acak antara 1-50
        ];
    }
}