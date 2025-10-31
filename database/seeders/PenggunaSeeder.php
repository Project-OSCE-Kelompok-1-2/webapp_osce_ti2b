<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengguna;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        // Buat akun default (misal admin manual)
        Pengguna::factory()->create([
            'username' => 'admin',
            'password' => bcrypt('admin123'),
            'jenis_role' => 'admin',
        ]);

        // Tambah data random
        Pengguna::factory(10)->create();
    }
}
