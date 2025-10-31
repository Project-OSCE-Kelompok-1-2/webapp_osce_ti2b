<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;

        $pengguna = Pengguna::where("username", $username)->first();

        if (!$pengguna) return back()->with("error", "Pengguna tidak ditemukan");

        if (Hash::check($password, $pengguna->password)) {
            Auth::login($pengguna);
            return redirect("/admin/profil");
        } else {
            return back()->with("error", "Username atau password salah");
        }
    }

    public function show_login()
    {
        return Inertia::render("Login");
    }

    public function logout()
    {
        Auth::logout();
        return redirect("/login");
    }

    public function show_dashboard_mahasiswa()
    {
        return Inertia::render("DashboardMahasiswa");
    }

    public function show_dashboard_admin()
    {
        return Inertia::render("Admin/Dashboard");
    }
}