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

        if (!$pengguna) return back()->with("error", "Pengguna tidak ditemukan");

        if ($pengguna->password == $password) {
            Auth::login($pengguna);

            if ($pengguna->jenis_role == "admin") {
                return redirect("/admin/dashboard")->with("success", "Berhasil login");
            } else if ($pengguna->jenis_role == "mahasiswa") {
                return redirect("/mahasiswa/dashboard")->with("success", "Berhasil login");
            } else if ($pengguna->jenis_role == "penguji") {
                return redirect("/penguji/dashboard")->with("success", "Berhasil login");
            }
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
