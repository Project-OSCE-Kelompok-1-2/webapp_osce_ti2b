<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Maatwebsite\Excel\Facades\Excel; // <-- Tambah
use Maatwebsite\Excel\Concerns\FromArray; // <-- Tambah
use Maatwebsite\Excel\Concerns\Exportable; // <-- Tambah

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
        Storage::fake('local'); // Gunakan fake storage 'local'

        // 1. Definisikan data palsu
        $filename = 'mahasiswa_import.xlsx';
        $header = ['nim', 'nama', 'kelas', 'prodi'];
        $row1 = ['123456', 'Pandu Test', '2025', 'Kedokteran'];
        $row2 = ['789012', 'Excel Test', '2025', 'Keperawatan'];

        // 2. Buat file Excel sungguhan di fake storage
        // Kita buat class export kecil secara 'inline'
        Excel::store(new class($header, $row1, $row2) implements FromArray
        {
            use Exportable;
            private $header, $row1, $row2;

            public function __construct($header, $row1, $row2)
            {
                $this->header = $header;
                $this->row1 = $row1;
                $this->row2 = $row2;
            }
            public function array(): array
            {
                // Data ini yang akan jadi isi Excel
                return [$this->header, $this->row1, $this->row2];
            }
        }, $filename, 'local'); // Simpan di disk 'local'

        // 3. Ambil path file yang baru dibuat dan jadikan UploadedFile
        $path = Storage::disk('local')->path($filename);
        $file = new UploadedFile(
            $path,
            $filename,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true // true = mode tes
        );

        // 4. Jalankan POST request
        $this->actingAs($this->admin)
            ->post('/admin/mahasiswa/import', [
                'file' => $file,
            ])
            ->assertRedirect()
            ->assertSessionHas('success'); // Sekarang ini akan lolos

        // 5. Cek apakah data DARI EXCEL PALSU itu benar-benar masuk
        $this->assertDatabaseHas('mahasiswa', ['nim' => '123456', 'nama' => 'Pandu Test']);
        $this->assertDatabaseHas('pengguna', ['username' => '123456']);

        $this->assertDatabaseHas('mahasiswa', ['nim' => '789012', 'nama' => 'Excel Test']);
        $this->assertDatabaseHas('pengguna', ['username' => '789012']);
    }
}
