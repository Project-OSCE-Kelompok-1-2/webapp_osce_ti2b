<?php

namespace Database\Factories;

use App\Models\Osce;
use App\Models\TahunAkademik;
use Illuminate\Database\Eloquent\Factories\Factory;

class OsceFactory extends Factory
{
    protected $model = Osce::class;

    public function definition(): array
    {
        $ta = TahunAkademik::inRandomOrder()->first() ?? TahunAkademik::factory()->create();

        $tanggalMulai = $this->faker->dateTimeBetween('now', '+1 month');

        return [
            'id_tahun_akademik' => $ta->id_tahun_akademik,
            'nama_osce' => "Ujian OSCE Periode " . $this->faker->monthName() . " " . date('Y'),
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => (clone $tanggalMulai)->modify('+3 days'),
        ];
    }
}
