<?php

namespace Database\Factories;

use App\Models\Enrollment;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enrollment>
 */
class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        return [
            'id_mahasiswa' => Mahasiswa::inRandomOrder()->value('id_mahasiswa') ?? 1,
            'id_tahun_akademik' => TahunAkademik::inRandomOrder()->value('id_tahun_akademik') ?? 1,
            'tanggal_daftar' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}