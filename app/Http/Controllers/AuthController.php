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
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = $request->username;
        $password = $request->password;

        $pengguna = Pengguna::where("username", $username)->first();

        if ($pengguna && Hash::check($password, $pengguna->password)) {
            Auth::login($pengguna);
            $request->session()->regenerate();

            $redirectPath = match ($pengguna->jenis_role) {
                "admin" => "/admin/dashboard",
                "mahasiswa" => "/mahasiswa/dashboard",
                "penguji" => "/penguji/dashboard",
            };

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
