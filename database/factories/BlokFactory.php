<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blok>
 */
class BlokFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * 
     */
    public function definition(): array
    {
        return [
            'nama_blok' =>$this->faker->word(),
            'deksripsi' =>$this->faker->paragraph(),
        ];
    }
}
