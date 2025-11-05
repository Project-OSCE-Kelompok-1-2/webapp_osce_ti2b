<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Osce;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Pengguna;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OsceJadwalControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $osce;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->osce = Osce::factory()->create();
    }

    /** @test */
    public function afkar_tugas1_admin_can_view_jadwal_list()
    {
        // Buat 2 stase di jam yang sama (1 sesi)
        OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce, 
            'tanggal' => '2025-10-10', 
            'jam_mulai' => '08:00'
        ]);
        OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce, 
            'tanggal' => '2025-10-10', 
            'jam_mulai' => '08:00'
        ]);
        
        // Buat 1 stase di jam lain (sesi kedua)
        OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce, 
            'tanggal' => '2025-10-11', 
            'jam_mulai' => '09:00'
        ]);
        
        // Daftarkan 5 mahasiswa ke OSCE ini
        EnrollmentOsce::factory()->count(5)->create(['id_osce' => $this->osce->id_osce]);

        $this->actingAs($this->admin)
            ->get("/admin/osce/{$this->osce->id_osce}/jadwal")
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/OsceJadwalPage') // Asumsi
                       ->has('sesi', 2) // Harapannya 2 sesi (hasil GROUP BY)
                       ->has('sesi.0', function ($props) {
                           // Cek struktur JSON
                           $props->hasAll(['id_osce_stase', 'tanggal', 'jam_mulai', 'jumlah_mahasiswa']);
                           $props->where('jumlah_mahasiswa', 5); // Cek logic hitung mahasiswa
                       });
            });
    }

    /** @test */
    public function afkar_tugas2_admin_can_create_jadwal_sesi()
    {
        $data = [
            'tanggal' => '2025-12-01',
            // Asumsi controller Afkar juga menangani field lain
            'id_stase' => Stase::factory()->create()->id_stase,
            'id_ruang' => Ruang::factory()->create()->id_ruang,
            'id_penguji' => Penguji::factory()->create()->id_penguji,
            'jam_mulai' => '10:00',
        ];

        $this->actingAs($this->admin)
            ->post("/admin/osce/{$this->osce->id_osce}/jadwal", $data)
            ->assertRedirect()
            ->assertSessionHas('success');
        
        $this->assertDatabaseHas('osce_stase', [
            'id_osce' => $this->osce->id_osce,
            'tanggal' => '2025-12-01'
        ]);
    }
}