<?php

namespace Tests\Feature\Penguji;

use Tests\TestCase;
use App\Models\Penguji;
use App\Services\ProfilService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Exception;

class ProfilIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public'); // Mocking storage agar tidak mengotori disk asli
    }

    // =========================================================================
    // BAGIAN 1: UNIT TEST SERVICE (Logika Bisnis Murni tanpa HTTP)
    // =========================================================================

    /** @test */
    public function service_can_upload_new_photo_and_update_database()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $service = new ProfilService();

        // Gunakan create() agar tidak butuh GD Library
        $file = UploadedFile::fake()->create('avatar_new.jpg', 100); 

        // Panggil Service
        $service->updateProfile($userAccount, [], $file);

        // Assert Database & Storage
        $userAccount->refresh();
        $this->assertNotNull($userAccount->path_gambar);
        $this->assertStringContainsString('profilpenguji', $userAccount->path_gambar);
        
        $pathRelatif = str_replace('storage/', '', $userAccount->path_gambar);
        Storage::disk('public')->assertExists($pathRelatif);
    }

    /** @test */
    public function service_can_delete_existing_photo()
    {
        // Setup User dengan foto awal
        $file = UploadedFile::fake()->create('old.jpg', 100);
        $path = $file->store('profilpenguji', 'public');

        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->path_gambar = 'storage/' . $path;
        $userAccount->save();

        $service = new ProfilService();

        // Panggil Service dengan flag delete_foto
        $service->updateProfile($userAccount, ['delete_foto' => true]);

        // Assert foto hilang
        $this->assertNull($userAccount->fresh()->path_gambar);
        Storage::disk('public')->assertMissing($path);
    }

    /** @test */
    public function service_updates_password_if_old_password_is_correct()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        $service = new ProfilService();

        $service->updateProfile($userAccount, [
            'old_password' => 'password123',
            'new_password' => 'rahasia456'
        ]);

        $this->assertTrue(Hash::check('rahasia456', $userAccount->fresh()->password));
    }

    /** @test */
    public function service_throws_exception_if_old_password_is_wrong()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        $service = new ProfilService();

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Password lama tidak sesuai.');

        $service->updateProfile($userAccount, [
            'old_password' => 'salah',
            'new_password' => 'rahasia456'
        ]);
    }

    // =========================================================================
    // BAGIAN 2: FEATURE TEST WEB (Controller + Inertia)
    // =========================================================================

    /** @test */
    public function web_user_can_view_profile_page()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;

        $response = $this->actingAs($userAccount)
                         ->get(route('penguji.account.show'));

        $response->assertStatus(200)
                 ->assertInertia(fn (Assert $page) => $page
                    ->component('Penguji/PengaturanAkun') // Pastikan nama komponen benar
                    ->has('user')
                 );
    }

    /** @test */
    public function web_user_can_update_profile_success()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        $response = $this->actingAs($userAccount)
                         ->post(route('penguji.account.update'), [
                             'old_password' => 'password123',
                             'new_password' => 'password_baru',
                             'new_password_confirmation' => 'password_baru',
                         ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Profil berhasil diperbarui!');
        $this->assertTrue(Hash::check('password_baru', $userAccount->fresh()->password));
    }

    /** @test */
    public function web_user_fails_update_if_old_password_wrong()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        $response = $this->actingAs($userAccount)
                         ->from(route('penguji.account.show'))
                         ->post(route('penguji.account.update'), [
                             'old_password' => 'salah_boss',
                             'new_password' => 'password_baru', // Valid panjangnya
                             'new_password_confirmation' => 'password_baru',
                         ]);

        $response->assertRedirect(route('penguji.account.show'));
        $response->assertSessionHasErrors(['old_password']);
    }

    // =========================================================================
    // BAGIAN 3: FEATURE TEST API (Controller + JSON)
    // =========================================================================

    /** @test */
    public function api_can_get_profile_json()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;

        $response = $this->actingAs($userAccount)
                         ->getJson(route('api.penguji.account.show'));

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => ['username', 'path_gambar'] // Sesuaikan dengan struktur tabel Anda
                 ]);
    }

    /** @test */
    public function api_can_update_profile_success()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        $response = $this->actingAs($userAccount)
                         ->postJson(route('api.penguji.account.update'), [
                             'old_password' => 'password123',
                             'new_password' => 'password_baru',
                             'new_password_confirmation' => 'password_baru',
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Profil berhasil diperbarui']);
        
        $this->assertTrue(Hash::check('password_baru', $userAccount->fresh()->password));
    }

    /** @test */
    public function api_returns_422_if_validation_fails()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;

        // Kasus: Password baru kurang dari 6 karakter (Validasi Laravel)
        $response = $this->actingAs($userAccount)
                         ->postJson(route('api.penguji.account.update'), [
                             'new_password' => '123', 
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['new_password']);
    }

    /** @test */
    public function api_returns_400_if_logic_fails_wrong_old_password()
    {
        $penguji = Penguji::factory()->create();
        $userAccount = $penguji->pengguna;
        $userAccount->password = Hash::make('password123');
        $userAccount->save();

        // Kasus: Validasi input lolos (password panjang), tapi logika salah (password lama tidak cocok)
        $response = $this->actingAs($userAccount)
                         ->postJson(route('api.penguji.account.update'), [
                             'old_password' => 'salah_boss',
                             'new_password' => 'password_baru',
                             'new_password_confirmation' => 'password_baru',
                         ]);

        $response->assertStatus(400)
                 ->assertJsonStructure(['success', 'message', 'errors' => ['old_password']]);
    }
}