<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use App\Models\{Pengguna, Mahasiswa, Penguji, Admin};

class PenggunaTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 🧠 Pastikan factory pengguna berfungsi dan membuat data valid
     */
    public function test_factory_dapat_membuat_pengguna_berbagai_role(): void
    {
        $roles = ['admin', 'penguji', 'mahasiswa'];

        foreach ($roles as $role) {
            $pengguna = Pengguna::factory()->create(['jenis_role' => $role]);
            $this->assertDatabaseHas('pengguna', [
                'id_pengguna' => $pengguna->id_pengguna,
                'jenis_role' => $role,
            ]);
        }
    }

    /**
     * 👨‍🎓 Cek relasi antara Mahasiswa dan Pengguna
     */
    public function test_pengguna_dapat_memiliki_relasi_dengan_mahasiswa(): void
    {
        $mhs = Mahasiswa::factory()->create();

        $this->assertNotNull($mhs->pengguna, 'Mahasiswa tidak memiliki relasi pengguna');
        $this->assertEquals('mahasiswa', $mhs->pengguna->jenis_role);
        $this->assertInstanceOf(Pengguna::class, $mhs->pengguna);
    }

    /**
     * 🧑‍🏫 Cek relasi antara Penguji dan Pengguna
     */
    public function test_pengguna_dapat_memiliki_relasi_dengan_penguji(): void
    {
        $penguji = Penguji::factory()->create();

        $this->assertNotNull($penguji->pengguna, 'Penguji tidak memiliki relasi pengguna');
        $this->assertEquals('penguji', $penguji->pengguna->jenis_role);
        $this->assertInstanceOf(Pengguna::class, $penguji->pengguna);
    }

    /**
     * 🛠️ Cek relasi antara Admin dan Pengguna
     */
    public function test_pengguna_dapat_memiliki_relasi_dengan_admin(): void
    {
        $admin = Admin::factory()->create();

        $this->assertNotNull($admin->pengguna, 'Admin tidak memiliki relasi pengguna');
        $this->assertEquals('admin', $admin->pengguna->jenis_role);
        $this->assertInstanceOf(Pengguna::class, $admin->pengguna);
    }

    /**
     * 🔒 Pastikan password selalu di-hash saat disimpan
     */
    public function test_password_dihash_otomatis(): void
    {
        $plainPassword = 'secret123';
        $pengguna = Pengguna::factory()->create(['password' => $plainPassword]);

        $this->assertNotEquals($plainPassword, $pengguna->password, 'Password masih plaintext');
        $this->assertTrue(Hash::check($plainPassword, $pengguna->password), 'Password tidak match setelah hash');
    }

    /**
     * 🚫 Pastikan username unik (tidak boleh duplikat)
     */
    public function test_username_harus_unique(): void
    {
        $username = 'unik_user';
        Pengguna::factory()->create(['username' => $username]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        Pengguna::factory()->create(['username' => $username]);
    }

    /**
     * 🧩 Pastikan relasi dua arah: dari Pengguna ke masing-masing role
     */
    public function test_relasi_dua_arah_pengguna_ke_role(): void
    {
        $mhs = Mahasiswa::factory()->create();
        $penguji = Penguji::factory()->create();
        $admin = Admin::factory()->create();

        $this->assertEquals($mhs->id_mahasiswa, $mhs->pengguna->mahasiswa->id_mahasiswa);
        $this->assertEquals($penguji->id_penguji, $penguji->pengguna->penguji->id_penguji);
        $this->assertEquals($admin->id_admin, $admin->pengguna->admin->id_admin);
    }

    /**
     * 🧮 Pastikan semua tabel saling terhubung via foreign key (consistency check)
     */
    public function test_konsistensi_foreign_key_antar_model(): void
    {
        $mhs = Mahasiswa::factory()->create();
        $this->assertDatabaseHas('mahasiswa', ['id_pengguna' => $mhs->pengguna->id_pengguna]);

        $penguji = Penguji::factory()->create();
        $this->assertDatabaseHas('penguji', ['id_pengguna' => $penguji->pengguna->id_pengguna]);

        $admin = Admin::factory()->create();
        $this->assertDatabaseHas('admin', ['id_pengguna' => $admin->pengguna->id_pengguna]);
    }
}
