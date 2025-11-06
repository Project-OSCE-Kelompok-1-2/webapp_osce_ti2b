<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MahasiswaControllerTest extends TestCase
{
    use RefreshDatabase;

    private $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
    }

    /** @test */
    public function ilham_tugas1_admin_can_view_mahasiswa_list()
    {
        Mahasiswa::factory()->count(5)->create();

        $this->actingAs($this->admin)
            ->get('/admin/mahasiswa')
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/MahasiswaPage') // Asumsi nama component
                       ->has('mahasiswa.data', 5)
                       ->has('mahasiswa.data.0', function ($props) {
                           $props->hasAll(['id_mahasiswa', 'nim', 'nama']);
                       });
            });
    }

    /** @test */
    public function ilham_tugas1_filter_mahasiswa_by_search_and_angkatan()
    {
        Mahasiswa::factory()->create(['nama' => 'Ilham A', 'kelas' => '2025']);
        Mahasiswa::factory()->create(['nama' => 'Bintang B', 'kelas' => '2024']);

        // Test search
        $this->actingAs($this->admin)
            ->get('/admin/mahasiswa?search=Ilham')
            ->assertInertia(fn ($assert) => $assert->has('mahasiswa.data', 1));
        
        // Test angkatan
        $this->actingAs($this->admin)
            ->get('/admin/mahasiswa?angkatan=2024')
            ->assertInertia(fn ($assert) => $assert->has('mahasiswa.data', 1));
    }

    /** @test */
    public function ilham_tugas2_admin_can_create_mahasiswa()
    {
        $data = [
            'nim' => '123456789',
            'nama' => 'Mahasiswa Baru',
            'kelas' => '2025',
            'prodi' => 'Kedokteran Gigi',
        ];

        $this->actingAs($this->admin)
            ->post('/admin/mahasiswa', $data)
            ->assertRedirect()
            ->assertSessionHas('success');

        // Cek data di 2 tabel
        $this->assertDatabaseHas('mahasiswa', ['nim' => '123456789']);
        $this->assertDatabaseHas('pengguna', ['username' => '123456789', 'jenis_role' => 'mahasiswa']);
    }

    /** @test */
    public function ilham_tugas2_create_mahasiswa_validation_fails()
    {
        $this->actingAs($this->admin)
            ->post('/admin/mahasiswa', ['nama' => 'Hanya Nama'])
            ->assertSessionHasErrors(['nim', 'kelas', 'prodi']);
    }
}