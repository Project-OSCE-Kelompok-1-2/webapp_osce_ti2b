<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\OsceStase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RekapNilaiListTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $osce;
    private $osceStase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->osce = Osce::factory()->create(['nama_osce' => 'OSCE Rekap']);
        $this->osceStase = OsceStase::factory()->create(['id_osce' => $this->osce->id_osce]);
    }

    /** @test */
    public function pandu_tugas2_admin_can_view_rekap_osce_list()
    {
        $this->actingAs($this->admin)
            ->get('/admin/rekap-nilai')
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/RekapOscePage') // Asumsi
                       ->has('osce.data.0', function ($props) {
                            // Cek struktur JSON Props Contract
                            $props->hasAll(['id_osce', 'nama_rubrik', 'rentang_tanggal', 'tahun_akademik']);
                            $props->where('nama_rubrik', 'OSCE Rekap');
                       });
            });
    }

    /** @test */
    public function pandu_tugas2_admin_can_view_rekap_sesi_list()
    {
        $this->actingAs($this->admin)
            ->get("/admin/rekap-nilai/{$this->osce->id_osce}/sesi")
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/RekapSesiPage') // Asumsi
                       ->has('sesi.0', function ($props) {
                            $props->hasAll(['id_sesi', 'tanggal_sesi', 'jumlah_mahasiswa']);
                       });
            });
    }
}