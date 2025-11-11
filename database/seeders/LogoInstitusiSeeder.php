<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LogoInstitusi;

class LogoInstitusiSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel logo_institusi.
     */
    public function run(): void
    {
        // Buat beberapa data logo institusi
        LogoInstitusi::factory()->count(3)->create();
    }
}
