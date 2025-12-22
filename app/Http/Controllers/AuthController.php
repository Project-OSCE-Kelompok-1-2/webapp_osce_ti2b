<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Dedoc\Scramble\Scramble;
use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

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

        $pengguna = $this->authService->verifyCredentials(
            $request->username,
            $request->password
        );

        if ($pengguna) {
            Auth::login($pengguna);
            $request->session()->regenerate();

            $redirectPath = $this->authService->getRedirectPathByRole($pengguna->jenis_role);

            return redirect($redirectPath)->with("success", "Berhasil login");
        } else {
            return back()->with("error", "Username atau password yang anda masukkan salah");
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
