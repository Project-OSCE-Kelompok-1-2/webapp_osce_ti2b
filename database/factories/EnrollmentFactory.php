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
        $mahasiswa = Mahasiswa::inRandomOrder()->first() ?? Mahasiswa::factory()->create();
        $tahunAkademik = TahunAkademik::inRandomOrder()->first() ?? TahunAkademik::factory()->create();

        return [
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'id_tahun_akademik' => $tahunAkademik->id_tahun_akademik,
            'tanggal_daftar' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
