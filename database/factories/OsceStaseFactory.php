<?php

namespace Database\Factories;

use App\Models\OsceStase;
use App\Models\Osce;
use App\Models\Penguji;
use App\Models\Ruang;
use App\Models\Stase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OsceStase>
 */
class OsceStaseFactory extends Factory
{
    protected $model = OsceStase::class;

    public function definition(): array
    {
        // Ambil salah satu OSCE agar tanggal tetap dalam rentang OSCE tersebut
        $osce = Osce::inRandomOrder()->first() ?? Osce::factory()->create();

        // Tentukan tanggal stase antara tanggal mulai dan selesai OSCE
        $tanggal = fake()->dateTimeBetween($osce->tanggal_mulai, $osce->tanggal_selesai);

        // Jam mulai dan selesai, durasi maksimal 3 jam
        $jamMulai = fake()->time('H:i');
        $durasi = rand(30, 180); // dalam menit
        $jamSelesai = date('H:i', strtotime($jamMulai) + $durasi * 60);

        return [
            'id_penguji' => Penguji::inRandomOrder()->value('id_penguji') ?? 1,
            'id_ruang' => Ruang::inRandomOrder()->value('id_ruang') ?? 1,
            'id_osce' => $osce->id_osce,
            'id_stase' => Stase::inRandomOrder()->value('id_stase') ?? 1,
            'tanggal' => $tanggal,
            'jam_mulai' => $jamMulai,
            'jam_selesai' => $jamSelesai,
            'skenario' => fake()->sentence(600),
            'durasi_per_mahasiswa' => fake()->numberBetween(1, 20), // menit
        ];
    }
}