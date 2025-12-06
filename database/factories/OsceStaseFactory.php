<?php

namespace Database\Factories;

use App\Models\Osce;
use App\Models\Penguji;
use App\Models\Ruang;
use App\Models\Stase;
use Illuminate\Database\Eloquent\Factories\Factory;

class OsceStaseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_osce' => Osce::inRandomOrder()->first()->id_osce ?? Osce::factory(),
            'id_stase' => Stase::inRandomOrder()->first()->id_stase ?? Stase::factory(),
            'id_penguji' => Penguji::inRandomOrder()->first()->id_penguji ?? Penguji::factory(),
            'id_ruang' => Ruang::inRandomOrder()->first()->id_ruang ?? Ruang::factory(),
            'tanggal' => now(),
            'jam_mulai' => '08:00',
            'jam_selesai' => '12:00',
            'skenario' => $this->faker->paragraph(),
            'durasi_per_mahasiswa' => 7,
        ];
    }
}
