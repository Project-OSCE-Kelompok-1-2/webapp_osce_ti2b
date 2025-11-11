<?php

namespace Tests\Feature\Admin;

use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test; // <-- 1. IMPORT SINTAKS BARU

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    private Pengguna $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Pengguna::factory()->create([
            'jenis_role' => 'admin',
            'password' => 'password123' // Pastikan factory Anda membuat ini
        ]);
        $this->actingAs($this->admin);
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function admin_can_successfully_update_their_password(): void
    {
        $response = $this->post(route('admin.account.update'), [
            'old_password' => 'password123', 
            'new_password' => 'password_baru_123',
            'new_password_confirmation' => 'password_baru_123',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->admin->refresh();
        $this->assertTrue(Hash::check('password_baru_123', $this->admin->password));
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function password_update_fails_if_old_password_is_incorrect(): void
    {
        $response = $this->post(route('admin.account.update'), [
            'old_password' => 'password_salah',
            'new_password' => 'password_baru_123',
            'new_password_confirmation' => 'password_baru_123',
        ]);

        $response->assertSessionHasErrors('old_password');
        $this->assertTrue(Hash::check('password123', $this->admin->fresh()->password));
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function admin_can_upload_a_new_profile_photo(): void
    {
        Storage::fake('public');

        // 3. UBAH DARI ->image() MENJADI ->create() UNTUK MENGHINDARI ERROR GD
        $file = UploadedFile::fake()->create('avatar.jpg', 100); // Buat file 100kb

        $response = $this->post(route('admin.account.update'), [
            'foto' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        Storage::disk('public')->assertExists('profiladmin/' . $file->hashName());
        $this->admin->refresh();
        $this->assertEquals('storage/profiladmin/' . $file->hashName(), $this->admin->path_gambar);
    }

    #[Test] // <-- 2. GUNAKAN SINTAKS BARU
    public function admin_can_delete_their_profile_photo(): void
    {
        Storage::fake('public');
        
        // 3. UBAH DARI ->image() MENJADI ->create()
        $file = UploadedFile::fake()->create('avatar.jpg', 100)->store('profiladmin', 'public');
        $this->admin->update(['path_gambar' => 'storage/' . $file]);

        Storage::disk('public')->assertExists($file);

        $response = $this->post(route('admin.account.update'), [
            'delete_foto' => true,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        Storage::disk('public')->assertMissing($file);
        $this->assertNull($this->admin->fresh()->path_gambar);
    }
}