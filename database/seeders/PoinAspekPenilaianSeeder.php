<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PoinAspekPenilaian;

class PoinAspekPenilaianSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel poin_aspek_penilaian.
     */
    public function run(): void
    {
        // Membuat beberapa data Poin Aspek Penilaian
        PoinAspekPenilaian::factory()->count(10)->create();
    }
}
