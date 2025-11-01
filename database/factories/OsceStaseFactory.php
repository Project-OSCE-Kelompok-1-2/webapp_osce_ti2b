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
        // Ambil salah satu OSCE atau buat baru
        $osce = Osce::inRandomOrder()->first() ?? Osce::factory()->create();

        // Tentukan tanggal stase antara tanggal mulai dan selesai OSCE
        $tanggal = fake()->dateTimeBetween($osce->tanggal_mulai, $osce->tanggal_selesai);

        // Jam mulai dan selesai, durasi maksimal 3 jam, tidak melewati 23:59
        $jamMulai = fake()->time('H:i');
        $durasi = rand(30, 180); // menit
        $jamMulaiTimestamp = strtotime($jamMulai);
        $jamSelesaiTimestamp = min($jamMulaiTimestamp + $durasi * 60, strtotime('23:59'));
        $jamSelesai = date('H:i', $jamSelesaiTimestamp);

        // Ambil FK atau buat baru jika kosong
        $pengujiId = Penguji::inRandomOrder()->value('id_penguji') ?? Penguji::factory()->create()->id_penguji;
        $ruangId = Ruang::inRandomOrder()->value('id_ruang') ?? Ruang::factory()->create()->id_ruang;
        $staseId = Stase::inRandomOrder()->value('id_stase') ?? Stase::factory()->create()->id_stase;

        return [
            'id_penguji' => $pengujiId,
            'id_ruang' => $ruangId,
            'id_osce' => $osce->id_osce,
            'id_stase' => $staseId,
            'tanggal' => $tanggal,
            'jam_mulai' => $jamMulai,
            'jam_selesai' => $jamSelesai,
            'skenario' => fake()->text(2000),
            'durasi_per_mahasiswa' => fake()->numberBetween(1, 20), // menit
        ];
    }
}
