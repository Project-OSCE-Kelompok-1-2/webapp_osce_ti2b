<?php

namespace Database\Seeders;

use App\Models\EnrollmentOsce;
use Illuminate\Database\Seeder;

class EnrollmentOsceSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'enrollment_osce'.
     * Catatan:
     * - Relasi tabel:
     *   1. tabel 'mahasiswa' dari domain sistem utama.
     */
    public function run(): void
    {
        EnrollmentOsce::factory(25)->create();
    }
}