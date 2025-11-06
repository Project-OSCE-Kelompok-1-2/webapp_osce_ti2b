<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Penguji;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PengujiControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
    }

    /** @test */
    public function asdif_tugas1_admin_can_view_penguji_index()
    {
        Penguji::factory()->count(3)->create();

        $this->actingAs($this->admin)
            ->get('/admin/dosen')
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/PengujiPage') // Asumsi nama component
                       ->has('penguji.data', 3)
                       ->has('penguji.data.0', function ($props) {
                           $props->hasAll(['id_penguji', 'nip', 'nama']);
                       });
            });
    }

    /** @test */
    public function asdif_tugas1_filter_penguji_by_search()
    {
        Penguji::factory()->create(['nama' => 'Dr. Asdif']);
        Penguji::factory()->create(['nama' => 'Dr. Pandu']);

        $this->actingAs($this->admin)
            ->get('/admin/dosen?search=Asdif')
            ->assertInertia(fn ($assert) => $assert->has('penguji.data', 1));
    }
    
    /** @test */
    public function asdif_tugas2_admin_can_create_penguji()
    {
        $data = [
            'nip' => '987654321',
            'nama' => 'Dr. Asdif Keren',
        ];

        $this->actingAs($this->admin)
            ->post('/admin/dosen', $data)
            ->assertRedirect()
            ->assertSessionHas('success');

        // Cek data di 2 tabel
        $this->assertDatabaseHas('penguji', ['nip' => '987654321']);
        $this->assertDatabaseHas('pengguna', ['username' => '987654321', 'jenis_role' => 'penguji']);
    }
}