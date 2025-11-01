<?php

namespace Database\Factories;

use App\Models\Osce;
use App\Models\TahunAkademik;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Osce>
 */
class OsceFactory extends Factory
{
    protected $model = Osce::class;

    public function definition(): array
    {
        // Ambil tahun akademik dari tabel relasi
        $tahunAkademik = TahunAkademik::inRandomOrder()->first() ?? TahunAkademik::factory()->create();
        $semester = fake()->randomElement(['GANJIL', 'GENAP']);

        // Tentukan tanggal mulai dan selesai
        $tanggalMulai = fake()->dateTimeBetween('-1 year', 'now');
        $tanggalSelesai = (clone $tanggalMulai)->modify('+14 days'); // max 2 minggu setelah mulai

        return [
            'id_tahun_akademik' => $tahunAkademik->id_tahun_akademik,
            'nama_osce' => "OSCE TAHUN AKADEMIK {$tahunAkademik->tahun} {$semester}",
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => $tanggalSelesai,
        ];
    }
}