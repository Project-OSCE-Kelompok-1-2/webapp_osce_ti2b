<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\AuthService; 
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

    // Inject Service
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function show_login()
    {
        return Inertia::render("Auth/Login");
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 1. PANGGIL SERVICE (Cek User)
        $pengguna = $this->authService->verifyCredentials(
            $request->username,
            $request->password
        );

        if ($pengguna) {
            // 2. LOGIKA WEB (Pakai Session)
            Auth::login($pengguna);
            $request->session()->regenerate();

            // Ambil path redirect dari service
            $redirectPath = $this->authService->getRedirectPathByRole($pengguna->jenis_role);

            return redirect($redirectPath)->with("success", "Berhasil login");
        } else {
            return back()->with("error", "Username atau password salah");
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect("/login")->with("success", "Berhasil logout");
    }
}