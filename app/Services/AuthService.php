<?php

namespace App\Services;

use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Memverifikasi username dan password.
     * Dipakai oleh Web DAN API.
     */
    public function verifyCredentials(string $username, string $password): ?Pengguna
    {
        $pengguna = Pengguna::where("username", $username)->first();

        if ($pengguna && Hash::check($password, $pengguna->password)) {
            return $pengguna;
        }

        return null;
    }

    /**
     * Menentukan arah redirect (Logika Bisnis).
     * Khusus untuk Web.
     */
    public function getRedirectPathByRole(string $jenis_role): string
    {
        return match ($jenis_role) {
            "admin" => "/admin/dashboard",
            "mahasiswa" => "/mahasiswa/dashboard",
            "penguji" => "/penguji/dashboard",
            default => "/dashboard",
        };
    }

    /**
     * Membuat Token Sanctum.
     * Khusus untuk API.
     */
    public function generateApiToken(Pengguna $pengguna, string $deviceName = 'mobile-app'): string
    {
        $pengguna->tokens()->delete();

        return $pengguna->createToken($deviceName)->plainTextToken;
    }

    /**
     * Logout API (Hapus Token).
     */
    public function revokeApiToken(Request $request): void
    {
        $request->user()->currentAccessToken()->delete();
    }
}