<?php

namespace Database\Seeders;

use App\Models\NilaiOsce;
use Illuminate\Database\Seeder;

class NilaiOsceSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'nilai_osce'.
     * 
     * Catatan:
     * - Relasi tabel di luar domain:
     *   1. Tabel 'poin_aspek_penilaian' dari domain penilaian.
     */
    public function run(): void
    {
        NilaiOsce::factory(25)->create();
    }
}