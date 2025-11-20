<?php

namespace Tests\Feature\Penguji;

use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test; // <-- 1. IMPORT SINTAKS BARU

class ProfilControllerTest extends TestCase
{
    use RefreshDatabase;

    private Pengguna $penguji;

    protected function setUp(): void
    {
        parent::setUp();

        $this->penguji = Pengguna::factory()->create([
            'jenis_role' => 'penguji',
            'password' => 'password123' // Pastikan factory Anda membuat ini
        ]);
        $this->actingAs($this->penguji);
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function penguji_can_successfully_update_their_password(): void
    {
        $response = $this->post(route('penguji.account.update'), [
            'old_password' => 'password123', 
            'new_password' => 'password_baru_123',
            'new_password_confirmation' => 'password_baru_123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->penguji->refresh();
        $this->assertTrue(Hash::check('password_baru_123', $this->penguji->password));
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function password_update_fails_if_old_password_is_incorrect(): void
    {
        $response = $this->post(route('penguji.account.update'), [
            'old_password' => 'password_salah',
            'new_password' => 'password_baru_123',
            'new_password_confirmation' => 'password_baru_123',
        ]);

        $response->assertSessionHasErrors('old_password');
        $this->assertTrue(Hash::check('password123', $this->penguji->fresh()->password));
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function penguji_can_upload_a_new_profile_photo(): void
    {
        Storage::fake('public');

        // 3. UBAH DARI ->image() MENJADI ->create() UNTUK MENGHINDARI ERROR GD
        $file = UploadedFile::fake()->create('avatar.jpg', 100); // Buat file 100kb

        $response = $this->post(route('penguji.account.update'), [
            'foto' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        Storage::disk('public')->assertExists('profilpenguji/' . $file->hashName());
        $this->penguji->refresh();
        $this->assertEquals('storage/profilpenguji/' . $file->hashName(), $this->penguji->path_gambar);
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function penguji_can_delete_their_profile_photo(): void
    {
        Storage::fake('public');
        
        // 3. UBAH DARI ->image() MENJADI ->create()
        $file = UploadedFile::fake()->create('avatar.jpg', 100)->store('profilpenguji', 'public');
        $this->penguji->update(['path_gambar' => 'storage/' . $file]);

        Storage::disk('public')->assertExists($file);

        $response = $this->post(route('penguji.account.update'), [
            'delete_foto' => true,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        Storage::disk('public')->assertMissing($file);
        $this->assertNull($this->penguji->fresh()->path_gambar);
    }
}