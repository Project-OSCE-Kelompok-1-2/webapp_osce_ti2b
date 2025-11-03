<?php

namespace Database\Seeders;

use App\Models\OsceStase;
use Illuminate\Database\Seeder;

class OsceStaseSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'osce_stase'.
     * 
     * Catatan:
     * - Tabel relasi ke luar domain:
     * Catatan:
     * - Relasi tabel:
     *   1. tabel 'penguji' dari domain sistem utama.
     *   2. tabel 'stase' dari domain akademik dan pembelajaran.
     */
    public function run(): void
    {
        OsceStase::factory(15)->create();
    }
}