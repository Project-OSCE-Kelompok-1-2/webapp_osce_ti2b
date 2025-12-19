<?php

namespace Tests\Feature\Auth;

use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function the_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertOk(); 
        $response->assertSee('<div id="app" data-page="', false); // Cek apakah ada elemen root Inertia
    }

    /** @test */
    public function a_user_can_authenticate_with_valid_credentials(): void
    {
        $pengguna = Pengguna::factory()->create([
            'jenis_role' => 'admin',
            'password' => 'password123',
        ]);

        $response = $this->post(route('login'), [
            'username' => $pengguna->username,
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/admin/dashboard');
    }

    /** @test */
    public function a_user_cannot_authenticate_with_an_invalid_password(): void
    {
        $pengguna = Pengguna::factory()->create();

        $response = $this->post(route('login'), [
            'username' => $pengguna->username,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHas('error', 'Username atau password salah');
    }

}
