<?php

namespace Database\Factories;

use App\Models\EnrollmentOsce;
use App\Models\Osce;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentOsceFactory extends Factory
{
    protected $model = EnrollmentOsce::class;

    public function definition(): array
    {
        return [
            'id_osce' => Osce::inRandomOrder()->first()->id_osce ?? Osce::factory(),
            'id_mahasiswa' => Mahasiswa::inRandomOrder()->first()->id_mahasiswa ?? Mahasiswa::factory(),
            'catatan' => null, 
            'tanggal_sesi' => now(),
            'jam_sesi' => '08:00',
        ];
    }
}
