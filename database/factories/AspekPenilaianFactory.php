<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Stase; // <-- Pastikan Anda punya model Stase

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AspekPenilaian>
 */
class AspekPenilaianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Sesuai ERD & Migrasi: id_stase (Foreign Key)
            // Cara terbaik adalah memanggil factory Stase.
            // Ini mengasumsikan Anda punya model Stase & StaseFactory.
            'id_stase' => Stase::factory(), 
            
            // Sesuai ERD & Migrasi: aspek (string)
            'aspek' => $this->faker->sentence(3), // Membuat kalimat palsu (3 kata)
            
            // Sesuai ERD & Migrasi: bobot_maksimum (integer)
            'bobot_maksimum' => $this->faker->numberBetween(1, 50), // Angka acak antara 1-50
        ];
    }
}