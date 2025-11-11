<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Blok;
use App\Models\Enrollment;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MataKuliah>
 */
class MataKuliahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * catatan :
     * relasi foreignKey : blok dan enrollment
     * kumpulan dari mata kuliah disebut dengan blok
     */
    public function definition(): array
    {
        return [
            'id_blok' => Blok::factory(),
            'id_enrollment' => Enrollment::factory(),
            'nama_mata_kuliah' => $this->faker->sentence(6),
            'deskripsi' => $this->faker->paragraph(),
        ];
    }
}
