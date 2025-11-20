<?php

namespace Database\Factories;

use App\Models\EnrollmentOsce;
use App\Models\Osce;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EnrollmentOsce>
 */
class EnrollmentOsceFactory extends Factory
{
    protected $model = EnrollmentOsce::class;

    public function definition(): array
    {
        return [
            'id_osce' => Osce::inRandomOrder()->value('id_osce') ?? 1,
            'id_mahasiswa' => Mahasiswa::inRandomOrder()->value('id_mahasiswa') ?? 1,
            'catatan' => fake()->text(600),
        ];
    }
}
