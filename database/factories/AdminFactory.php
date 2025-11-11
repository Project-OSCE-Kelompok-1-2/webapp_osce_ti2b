<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition(): array
    {
        return [
            'id_pengguna' => Pengguna::factory()->state(['jenis_role' => 'admin']),
        ];
    }
}
