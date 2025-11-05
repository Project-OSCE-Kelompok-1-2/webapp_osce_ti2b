<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\TahunAkademik;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OsceControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $tahunAkademik;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->tahunAkademik = TahunAkademik::factory()->create();
    }

    /** @test */
    public function bintang_tugas1_admin_can_view_osce_index()
    {
        Osce::factory()->create(['id_tahun_akademik' => $this->tahunAkademik->id_tahun_akademik]);

        $this->actingAs($this->admin)
            ->get('/admin/osce')
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/OsceListPage') // Asumsi
                       ->has('osce.data.0', function ($props) {
                           // Cek struktur JSON sesuai Props Contract
                           $props->hasAll([
                               'id_osce', 'nama_osce', 'detail_stase', 
                               'detail_mahasiswa', 'detail_sesi', 'tanggal_mulai',
                               'tanggal_selesai', 'tahun_akademik'
                           ]);
                       });
            });
    }

    /** @test */
    public function bintang_tugas2_admin_can_create_osce()
    {
        $data = [
            'nama_osce' => 'OSCE Baru Bintang',
            'id_tahun_akademik' => $this->tahunAkademik->id_tahun_akademik,
            'tanggal_mulai' => '2025-01-01',
            'tanggal_selesai' => '2025-01-02',
        ];

        $this->actingAs($this->admin)
            ->post('/admin/osce', $data)
            ->assertRedirect()
            ->assertSessionHas('success');
        
        $this->assertDatabaseHas('osce', ['nama_osce' => 'OSCE Baru Bintang']);
    }

    /** @test */
    public function bintang_tugas2_create_osce_validation_fails()
    {
        $this->actingAs($this->admin)
            ->post('/admin/osce', ['nama_osce' => 'Test Saja'])
            ->assertSessionHasErrors(['id_tahun_akademik', 'tanggal_mulai', 'tanggal_selesai']);
    }
}