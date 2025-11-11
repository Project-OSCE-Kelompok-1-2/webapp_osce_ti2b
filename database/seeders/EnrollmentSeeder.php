<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel 'enrollment'.
     * 
     * Catatan:
     * - Relasi tabel:
     *   1. tabel 'mahasiswa' dari domain sistem utama.
     *   2. tabel 'tahun_akademik' dari domain sistem utama.
     */
    public function run(): void
    {
        Enrollment::factory(30)->create();
    }
}