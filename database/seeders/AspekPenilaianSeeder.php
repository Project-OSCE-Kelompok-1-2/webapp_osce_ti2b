<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AspekPenilaian;

class AspekPenilaianSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel aspek_penilaian.
     */
    public function run(): void
    {
        // Membuat beberapa data Aspek Penilaian (bisa disesuaikan jumlahnya)
        AspekPenilaian::factory()->count(5)->create();
    }
}
