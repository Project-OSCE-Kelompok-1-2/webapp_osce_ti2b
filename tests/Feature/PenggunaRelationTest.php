<?php


namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use App\Models\Pengguna;
use App\Models\Mahasiswa;
use App\Models\Penguji;
use App\Models\Admin;

class PenggunaRelationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function pengguna_dapat_memiliki_relasi_dengan_mahasiswa()
    {
        // Buat Mahasiswa + Pengguna otomatis via factory
        $mhs = Mahasiswa::factory()->create();

        // Pastikan relasi ke pengguna tidak null
        $this->assertNotNull($mhs->pengguna);
        $this->assertEquals('mahasiswa', $mhs->pengguna->jenis_role);

        // Pastikan relasi baliknya juga benar
        $this->assertEquals($mhs->id_mahasiswa, $mhs->pengguna->mahasiswa->id_mahasiswa);
    }

    /** @test */
    public function pengguna_dapat_memiliki_relasi_dengan_penguji()
    {
        $penguji = Penguji::factory()->create();

        $this->assertNotNull($penguji->pengguna);
        $this->assertEquals('penguji', $penguji->pengguna->jenis_role);
        $this->assertEquals($penguji->id_penguji, $penguji->pengguna->penguji->id_penguji);
    }

    /** @test */
    public function pengguna_dapat_memiliki_relasi_dengan_admin()
    {
        $admin = Admin::factory()->create();

        $this->assertNotNull($admin->pengguna);
        $this->assertEquals('admin', $admin->pengguna->jenis_role);
        $this->assertEquals($admin->id_admin, $admin->pengguna->admin->id_admin);
    }

    /** @test */
    public function factory_dapat_membuat_pengguna_berbagai_role()
    {
        $admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $penguji = Pengguna::factory()->create(['jenis_role' => 'penguji']);
        $mahasiswa = Pengguna::factory()->create(['jenis_role' => 'mahasiswa']);

        $this->assertTrue($admin->isAdmin());
        $this->assertTrue($penguji->isPenguji());
        $this->assertTrue($mahasiswa->isMahasiswa());
    }

    /** @test */
    public function username_harus_unique()
    {
        $first = \App\Models\Pengguna::factory()->create(['username' => 'uniqueuser']);
        $this->expectException(\Illuminate\Database\QueryException::class);

        \App\Models\Pengguna::factory()->create(['username' => 'uniqueuser']);
    }

    /** @test */
    public function password_harus_terhash_otomatis()
    {
        $pengguna = \App\Models\Pengguna::factory()->create([
            'password' => 'plaintext123'
        ]);

        $this->assertNotEquals('plaintext123', $pengguna->password);
        $this->assertTrue(Hash::check('plaintext123', $pengguna->password));
    }
}
