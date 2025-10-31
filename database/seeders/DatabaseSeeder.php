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
        // Data default bawaan Laravel
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        //  Jalankan semua seeder kustom
        $this->call([
            PenggunaSeeder::class,
            AdminSeeder::class,
            MahasiswaSeeder::class,
            PengujiSeeder::class,
        ]);
    }
}
