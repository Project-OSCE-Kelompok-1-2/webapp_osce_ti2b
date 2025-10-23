<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Pengguna;

class AdminController extends Controller
{
    public function update_profile(Request $request)
    {
    $new_password = $request->new_password;
    $pengguna = Pengguna::where('id', auth()->user()->id)->get();
    $pengguna->password = Hash::make($new_password);
    $pengguna->save();
    return back()->with('success', 'Password berhasil diupdate.');
    }
}
