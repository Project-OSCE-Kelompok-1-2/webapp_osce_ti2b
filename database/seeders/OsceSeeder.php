<?php

namespace Database\Seeders;

use App\Models\Osce;
use Illuminate\Database\Seeder;

class OsceSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'osce'.
     * 
     * Catatan:
     * - Relasi tabel di luar domain:
     *   1. Tabel 'tahun_akademik' dari domain sistem utama
     *      */
    public function run(): void
    {
        Osce::factory(5)->create();
    }
}