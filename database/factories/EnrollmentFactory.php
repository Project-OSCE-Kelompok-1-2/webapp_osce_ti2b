<?php

namespace Database\Factories;

use App\Models\Enrollment;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        return [
            'id_mahasiswa' => Mahasiswa::inRandomOrder()->first()->id_mahasiswa ?? Mahasiswa::factory(),
            'id_tahun_akademik' => TahunAkademik::inRandomOrder()->first()->id_tahun_akademik ?? TahunAkademik::factory(),
            'tanggal_daftar' => now(),
        ];
    }
}
