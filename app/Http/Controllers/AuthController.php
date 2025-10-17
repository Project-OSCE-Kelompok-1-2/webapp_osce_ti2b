<?php

namespace App\Http\Controllers;

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

        if (!$pengguna) {
            return back()->with("error", "Tidak dapat menemukan user");
        }

        if (Hash::check($password, $pengguna->password)) {
            Auth::login($pengguna);

            return redirect("/dashboard")->with("success", "Berhasil melakukan login");
        }

        return back()->with("error", "Username atau password salah");
    }
}
