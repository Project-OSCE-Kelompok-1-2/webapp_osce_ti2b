<?php

namespace Database\Seeders;

use App\Models\Ruang;
use Illuminate\Database\Seeder;

class RuangSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'ruang'.
     */
    public function run(): void
    {
        Ruang::factory(10)->create();
    }
}
