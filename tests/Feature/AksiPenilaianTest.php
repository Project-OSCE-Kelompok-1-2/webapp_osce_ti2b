<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\PoinAspekPenilaian;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AksiPenilaianTest extends TestCase
{
    use RefreshDatabase;

    // Membuat pengguna dengan role penguji dan melakukan autentikasi
    private function actingAsPenguji()
    {
        $penguji = Pengguna::factory()->create(['jenis_role' => 'penguji']);
        $this->actingAs($penguji); // melakukan login sebagai penguji
        return $penguji;
    }

    /** @test */
    public function simpan_nilai_endpoint_berhasil_dipanggil()
    {
        $this->actingAsPenguji(); // login sebagai penguji

        // Membuat data OSCE agar endpoint dapat dipanggil
        $osce = Osce::factory()->create(['tanggal_selesai' => now()->addDay()]);

        // Membuat stase untuk OSCE ini
        $stase = OsceStase::factory()->create(['id_osce' => $osce->id_osce]);

        // Membuat enrollment mahasiswa untuk OSCE ini
        $enroll = EnrollmentOsce::factory()->create(['id_osce' => $osce->id_osce]);

        // Membuat poin aspek penilaian yang valid untuk pengujian
        $poin = PoinAspekPenilaian::factory()->create();

        // Memanggil endpoint simpan nilai dan mengirim data skor
        $response = $this->post("/penguji/penilaian/{$enroll->id_enrollment_osce}", [
            'nilai' => [
                [
                    'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                    'skor' => 90
                ]
            ]
        ]);

        $response->assertStatus(200); // memastikan respons berhasil

        // Mengecek apakah nilai tersimpan di tabel poin_aspek_penilaian
        $this->assertDatabaseHas('poin_aspek_penilaian', [
            'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
            'skor' => 90
        ]);
    }

    /** @test */
    public function rotasi_endpoint_berhasil_dipanggil()
    {
        $this->actingAsPenguji(); // login sebagai penguji

        // Membuat OSCE dan stase untuk uji rotasi
        $osce = Osce::factory()->create(['tanggal_selesai' => now()->addDay()]);
        $stase1 = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce, 
            'tanggal' => now(), 
            'jam_mulai' => '08:00'
        ]);

        // Membuat beberapa enrollment mahasiswa agar rotasi memiliki data
        EnrollmentOsce::factory()->count(2)->create(['id_osce' => $osce->id_osce]);

        // Memanggil endpoint rotasi
        $response = $this->get("/penguji/rotasi/{$stase1->id_osce_stase}");
        $response->assertStatus(200); // memastikan rotasi berhasil
    }

    /** @test */
    public function selesai_sesi_endpoint_berhasil_dipanggil()
    {
        $this->actingAsPenguji(); // login sebagai penguji

        // Membuat OSCE dan stase untuk uji selesai sesi
        $osce = Osce::factory()->create(['tanggal_selesai' => now()->addDay()]);
        $stase = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce, 
            'tanggal' => now(), 
            'jam_mulai' => '08:00'
        ]);

        // Memanggil endpoint selesai sesi
        $response = $this->post("/penguji/rotasi/{$stase->id_osce_stase}/selesai");
        $response->assertStatus(200); // memastikan sesi berhasil ditandai selesai
    }
}