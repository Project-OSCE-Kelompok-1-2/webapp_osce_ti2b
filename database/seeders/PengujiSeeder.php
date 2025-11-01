<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Penguji;

class PengujiSeeder extends Seeder
{
    public function run(): void
    {
        Penguji::factory(5)->create();
    }
}
