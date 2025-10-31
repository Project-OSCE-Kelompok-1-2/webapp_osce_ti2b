<?php

namespace Database\Factories;

use App\Models\NilaiOsce;
use App\Models\EnrollmentOsce;
use App\Models\PoinAspekPenilaian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NilaiOsce>
 */
class NilaiOsceFactory extends Factory
{
    protected $model = NilaiOsce::class;

    public function definition(): array
    {
        return [
            'id_enrollment_osce' => EnrollmentOsce::inRandomOrder()->value('id_enrollment_osce') ?? 1,
            'id_poin_aspek_penilaian' => PoinAspekPenilaian::inRandomOrder()->value('id_poin_aspek_penilaian') ?? 1,
            'nilai' => fake()->randomFloat(2, 0, 100),
        ];
    }
}