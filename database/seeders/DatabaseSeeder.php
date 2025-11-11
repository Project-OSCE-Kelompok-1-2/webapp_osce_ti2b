<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        //  Jalankan semua seeder kustom
        $this->call([
            LogoInstitusiSeeder::class,       // 2025_10_30_010001_create_logo_institusi_table.php
            PenggunaSeeder::class,            // 2025_10_30_010002_create_pengguna_table.php
            TahunAkademikSeeder::class,       // 2025_10_30_010003_create_tahun_akademik_table.php
            BlokSeeder::class,                // 2025_10_30_010004_create_blok_table.php
            TujuanPembelajaranSeeder::class,  // 2025_10_30_010005_create_tujuan_pembelajaran_table.php
            RuangSeeder::class,               // 2025_10_30_010006_create_ruang_table.php
            AdminSeeder::class,               // 2025_10_30_020001_create_admin_table.php
            MahasiswaSeeder::class,           // 2025_10_30_020002_create_mahasiswa_table.php
            PengujiSeeder::class,             // 2025_10_30_020003_create_penguji_table.php
            EnrollmentSeeder::class,          // 2025_10_30_020004_create_enrollment_table.php
            MataKuliahSeeder::class,          // 2025_10_30_020005_create_mata_kuliah_table.php
            StaseSeeder::class,               // 2025_10_30_020006_create_stase_table.php
            AspekPenilaianSeeder::class,      // 2025_10_30_020007_create_aspek_penilaian_table.php
            PoinAspekPenilaianSeeder::class,  // 2025_10_30_020008_create_poin_aspek_penilaian_table.php
            OsceSeeder::class,                // 2025_10_30_020009_create_osce_table.php
            EnrollmentOsceSeeder::class,      // 2025_10_30_020010_create_enrollment_osce_table.php
            NilaiOsceSeeder::class,           // 2025_10_30_020011_create_nilai_osce_table.php
            OsceStaseSeeder::class,           // 2025_10_30_020012_create_osce_stase_table.php
        ]);
    }
}
