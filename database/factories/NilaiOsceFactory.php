<?php

namespace Database\Factories;

use App\Models\NilaiOsce;
use App\Models\EnrollmentOsce;
use App\Models\PoinAspekPenilaian;
use Illuminate\Database\Eloquent\Factories\Factory;

class NilaiOsceFactory extends Factory
{
    protected $model = NilaiOsce::class;

    public function definition(): array
    {
        return [
            'id_enrollment_osce' => EnrollmentOsce::inRandomOrder()->first()->id_enrollment_osce ?? EnrollmentOsce::factory(),
            'id_poin_aspek_penilaian' => PoinAspekPenilaian::inRandomOrder()->first()->id_poin_aspek_penilaian ?? PoinAspekPenilaian::factory(),
            'nilai' => $this->faker->randomElement([0, 1, 2, 3, 4]),
        ];
    }
}
