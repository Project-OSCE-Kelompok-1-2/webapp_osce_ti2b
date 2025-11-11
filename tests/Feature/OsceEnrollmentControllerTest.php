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
    private $osceStase;
    private $mahasiswaTerdaftar;
    private $mahasiswaBelumDaftar;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->osce = Osce::factory()->create();
        $this->osceStase = OsceStase::factory()->create(['id_osce' => $this->osce->id_osce]);

        // Mahasiswa 1: Sudah terdaftar (NIM MHS001, di-sort pertama)
        $this->mahasiswaTerdaftar = Mahasiswa::factory()->create(['nim' => 'MHS001', 'nama' => 'Mahasiswa Terdaftar']);
        EnrollmentOsce::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $this->mahasiswaTerdaftar->id_mahasiswa
        ]);

        // Mahasiswa 2: Belum terdaftar (NIM MHS002, di-sort kedua)
        $this->mahasiswaBelumDaftar = Mahasiswa::factory()->create(['nim' => 'MHS002', 'nama' => 'Mahasiswa Belum']);
    }

    /** @test */
    public function najwa_tugas1_admin_can_view_enrollment_list()
    {
        $endpoint = "/admin/osce/{$this->osce->id_osce}/jadwal/{$this->osceStase->id_osce_stase}/enrollment";

        // Panggil endpoint dan pastikan sukses (200 OK)
        $response = $this->actingAs($this->admin)
            ->get($endpoint)
            ->assertSuccessful(); 
        
        // Assert data yang diteruskan ke Inertia (props)
        $response->assertInertia(function ($assert) {
            $assert->component('Admin/OsceEnrollmentPage')
                   
                   // Cek bahwa 'mahasiswa.data' adalah array dan memiliki 2 item
                   // (Sesuai controller yang menggunakan paginate() dan setup kita)
                   ->has('mahasiswa.data', 3) 
                   
                   // Cek data mahasiswa pertama (MHS001 - Terdaftar)
                   // Urutan ini dijamin oleh orderBy('nim') di controller
                   ->where('mahasiswa.data.0.nim', $this->mahasiswaTerdaftar->nim)
                   ->where('mahasiswa.data.0.is_enrolled', true)
                   
                   // Cek data mahasiswa kedua (MHS002 - Belum Daftar)
                   ->where('mahasiswa.data.1.nim', $this->mahasiswaBelumDaftar->nim)
                   ->where('mahasiswa.data.1.is_enrolled', false);
        });
    }

    /** @test */
    public function najwa_tugas2_admin_can_sync_enrollment()
    {
        $endpoint = "/admin/osce/{$this->osce->id_osce}/jadwal/{$this->osceStase->id_osce_stase}/enrollment";
        
        $data = [
            'id_mahasiswa_array' => [$this->mahasiswaBelumDaftar->id_mahasiswa]
        ];

        $this->actingAs($this->admin)
            ->post($endpoint, $data)
            ->assertRedirect()
            ->assertSessionHas('success');
        
        // Cek database
        $this->assertDatabaseMissing('enrollment_osce', [
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $this->mahasiswaTerdaftar->id_mahasiswa
        ]);

        $this->assertDatabaseHas('enrollment_osce', [
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $this->mahasiswaBelumDaftar->id_mahasiswa
        ]);
    }
}
