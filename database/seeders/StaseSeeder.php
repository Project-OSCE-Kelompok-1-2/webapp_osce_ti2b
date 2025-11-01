<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Stase; // Pastikan Anda mengimpor model Stase

class StaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama jika ada
        Stase::truncate();

        // Buat 3 data dummy
        Stase::create([
            'nama' => 'Stase Bedah',
            'nama_mata_kuliah' => 'Ilmu Bedah Dasar',
            'deskripsi' => 'Mencakup prinsip-prinsip dasar bedah.',
            'jumlah_aspek' => 5,
        ]);

        Stase::create([
            'nama' => 'Stase Anak',
            'nama_mata_kuliah' => 'Pediatri',
            'deskripsi' => 'Fokus pada kesehatan anak dan remaja.',
            'jumlah_aspek' => 4,
        ]);

        Stase::create([
            'nama' => 'Stase Penyakit Dalam',
            'nama_mata_kuliah' => 'Interna',
            'deskripsi' => 'Mempelajari penyakit organ dalam.',
            'jumlah_aspek' => 6,
        ]);
    }
}
