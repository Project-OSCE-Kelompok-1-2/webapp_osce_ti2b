<?php

namespace Database\Factories;

use App\Models\Stase;
use Illuminate\Database\Eloquent\Factories\Factory;

class AspekPenilaianFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_stase' => Stase::inRandomOrder()->first()->id_stase ?? Stase::factory(),
            'aspek' => $this->faker->sentence(3),
            'bobot_maksimum' => 25, 
        ];
    }
}
