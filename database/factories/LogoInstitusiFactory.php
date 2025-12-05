<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LogoInstitusiFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nama_institusi' => 'Politeknik Negeri Semarang',
            'path_logo' => 'images/logo_polines.png',
            'deskripsi' => 'Kampus Kesehatan Terpadu',
        ];
    }
}
