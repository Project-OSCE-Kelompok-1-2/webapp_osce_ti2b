<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TahunAkademik;

class TahunAkademikSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel tahun_akademik.
     */
    public function run(): void
    {
        // Buat beberapa data tahun akademik
        TahunAkademik::factory()->count(3)->create();
    }
}
