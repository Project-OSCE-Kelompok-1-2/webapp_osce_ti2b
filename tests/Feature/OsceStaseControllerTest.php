<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OsceStaseControllerTest extends TestCase
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
    public function ifad_tugas1_admin_can_view_osce_stase_list()
    {
        $stase = Stase::factory()->create(['nama_stase' => 'Stase Ifad']);
        OsceStase::factory()->count(2)->create([
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $stase->id_stase
        ]);

        $this->actingAs($this->admin)
            ->get("/admin/osce/{$this->osce->id_osce}/stase")
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/OsceStasePage') // Asumsi
                       ->has('stase.data', 2)
                       ->has('stase.data.0', function ($props) {
                           // Cek struktur JSON sesuai Props Contract
                           $props->hasAll(['id_osce_stase', 'ruang', 'stase', 'penguji']);
                           $props->where('stase.nama_stase', 'Stase Ifad');
                       });
            });
    }

    /** @test */
    public function ifad_tugas2_admin_can_add_stase_to_osce()
    {
        $ruang = Ruang::factory()->create();
        $stase = Stase::factory()->create();
        $penguji = Penguji::factory()->create();

        $data = [
            'id_ruang' => $ruang->id_ruang,
            'id_stase' => $stase->id_stase,
            'id_penguji' => $penguji->id_penguji,
        ];

        $this->actingAs($this->admin)
            ->post("/admin/osce/{$this->osce->id_osce}/stase", $data)
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('osce_stase', [
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $stase->id_stase,
            'id_penguji' => $penguji->id_penguji
        ]);
    }
}