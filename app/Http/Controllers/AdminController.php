<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function update_profile(Request $request)
    {
    $new_password = $request->new_password;
    $pengguna = Pengguna::where('id', auth()->user()->id)->first();
    $pengguna->password = Hash::make($new_password);
    $pengguna->save();
    return redirect("/admin/profil")->with('success', 'Password berhasil diupdate.');
    }
    public function show_profile()
    {
        return Inertia::render('Admin/Profil');
    }
}
