<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MahasiswaImportTest extends TestCase
{
    use RefreshDatabase;

    private $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
    }

    /** @test */
    public function pandu_tugas1_admin_can_import_mahasiswa_excel()
    {
        Storage::fake('local');

        // Buat file Excel palsu
        // Anda perlu library `maatwebsite/excel` dan membuat file palsu di sini
        // $file = ... (buat file excel palsu)
        
        // Baris ini hanya placeholder, Anda harus membuat file excel palsu
        $file = UploadedFile::fake()->create('mahasiswa.xlsx');

        $this->actingAs($this->admin)
            ->post('/admin/mahasiswa/import', [
                'file' => $file,
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        // Cek apakah data dari excel palsu itu masuk
        // $this->assertDatabaseHas('mahasiswa', ['nim' => '...']);
    }
}