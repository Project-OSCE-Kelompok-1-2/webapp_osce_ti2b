<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stase>
 */
class StaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * catatan :
     * relasi foreignkey : mata kuliah dan tujuan pemblejaran.
     * satu mata kuliah memiliki banyak stase.
     * satu stase memiliki banyak tujuan pembelajaran
     */
    public function definition(): array
    {
        return [
            'id_mata_kuliah' => MataKuliah::factory(),
            'id_tujuan_pembelajaran' => TujuanPembelajaran::factory(),
            'nama_stase' => $this->faker->sentence(2),
            'deskripsi' => $this->faker->paragraph(),
        ];
    }
}
