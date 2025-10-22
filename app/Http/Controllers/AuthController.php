<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function show_login()
    {
        return Inertia::render("Auth/Login");
    }

    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;

        $pengguna = Pengguna::where("username", $username)->first();

        if (!$pengguna) {
            return back()->with("error", "User tidak ditemukan");
        }

        if (Hash::check($password, $pengguna->password)) {
            Auth::login($pengguna);

            return redirect("/dashboard")->with("success", "Berhasil login");
        }

        return back()->with("error", "Username atau password salah");
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect("/login")->with("success", "Berhasil logout");
    }
}
