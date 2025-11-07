<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\Mahasiswa;
use App\Models\EnrollmentOsce;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OsceEnrollmentControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $osce;
    private $osceStase; // Asumsi {jadwal_id} adalah {id_osce_stase}
    private $mahasiswaTerdaftar;
    private $mahasiswaBelumDaftar;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->osce = Osce::factory()->create();
        $this->osceStase = OsceStase::factory()->create(['id_osce' => $this->osce->id_osce]);

        // Mahasiswa 1: Sudah terdaftar
        $this->mahasiswaTerdaftar = Mahasiswa::factory()->create();
        EnrollmentOsce::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $this->mahasiswaTerdaftar->id_mahasiswa
        ]);

        // Mahasiswa 2: Belum terdaftar
        $this->mahasiswaBelumDaftar = Mahasiswa::factory()->create();
    }

    /** @test */
    public function najwa_tugas1_admin_can_view_enrollment_list()
    {
        $endpoint = "/admin/osce/{$this->osce->id_osce}/jadwal/{$this->osceStase->id_osce_stase}/enrollment";

        $this->actingAs($this->admin)
            ->get($endpoint)
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/OsceEnrollmentPage') // Asumsi
                       ->has('mahasiswa.data', 2) // Ada 2 total mahasiswa
                       ->where('mahasiswa.data.0.nim', $this->mahasiswaTerdaftar->nim)
                       ->where('mahasiswa.data.0.is_enrolled', true) // Cek logic is_enrolled
                       ->where('mahasiswa.data.1.nim', $this->mahasiswaBelumDaftar->nim)
                       ->where('mahasiswa.data.1.is_enrolled', false); // Cek logic is_enrolled
            });
    }

    /** @test */
    public function najwa_tugas2_admin_can_sync_enrollment()
    {
        $endpoint = "/admin/osce/{$this->osce->id_osce}/jadwal/{$this->osceStase->id_osce_stase}/enrollment";
        
        // Data baru: Hapus mhs 1, tambahkan mhs 2
        $data = [
            'id_mahasiswa_array' => [$this->mahasiswaBelumDaftar->id_mahasiswa]
        ];

        $this->actingAs($this->admin)
            ->post($endpoint, $data) // Sesuai Props Contract: POST atau PUT
            ->assertRedirect()
            ->assertSessionHas('success');
        
        // Cek database
        $this->assertDatabaseMissing('enrollment_osce', [
            'id_mahasiswa' => $this->mahasiswaTerdaftar->id_mahasiswa
        ]);
        $this->assertDatabaseHas('enrollment_osce', [
            'id_mahasiswa' => $this->mahasiswaBelumDaftar->id_mahasiswa
        ]);
    }
}