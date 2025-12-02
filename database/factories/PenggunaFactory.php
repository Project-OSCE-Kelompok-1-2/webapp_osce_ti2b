<?php

namespace Database\Factories;

use App\Models\Pengguna;
use App\Models\Penguji;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengguna>
 */
class PenggunaFactory extends Factory
{
    protected $model = Pengguna::class;

    public function definition(): array
    {
        return [
            'username'   => $this->faker->unique()->userName(),
            'password'   => 'password123', // password akan di-hash oleh Mutator/Casts di Model
            'jenis_role' => $this->faker->randomElement(['admin', 'mahasiswa']),
        ];
    }

    // /**
    //  * Konfigurasi hooks factory.
    //  */
    // public function configure(): static
    // {
    //     return $this->afterCreating(function (Pengguna $user) {
    //         // Pastikan ID tersedia
    //         if (!$user->id) {
    //             return;
    //         }

    //         // Jika role adalah penguji, buatkan data di tabel penguji
    //         if ($user->jenis_role === 'penguji') {
    //             // Cek duplikasi
    //             if (Penguji::where('id_pengguna', $user->id)->doesntExist()) {

    //                 // Gunakan unguarded untuk mem-bypass error $fillable jika model Penguji belum disetting fillable-nya
    //                 Penguji::unguarded(function () use ($user) {
    //                     Penguji::factory()->create([
    //                         'id_pengguna' => $user->id,
    //                     ]);
    //                 });
    //             }
    //         }
    //     });
    // }
}
