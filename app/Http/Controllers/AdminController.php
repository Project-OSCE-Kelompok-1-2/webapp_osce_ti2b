<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function update_profile(Request $request)
    {
        $request->validate([
            'nama' => 'nullable|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            $pengguna = Pengguna::findOrFail(auth()->user()->id);
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');
                $filename = time() . '_' . $foto->getClientOriginalName();

                if ($pengguna->foto && file_exists(public_path($pengguna->foto))) {
                    unlink(public_path($pengguna->foto));
                }

                $foto->move(public_path('storage/profil'), $filename);
                $pengguna->foto = 'asset/' . $filename;
            }
        
            $pengguna->save();

            return redirect("/admin/profil")->with('success', 'Profil berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Gagal memperbarui profil: ' . $e->getMessage());
            return redirect("/admin/profil")->with('error', 'Gagal memperbarui profil: ' . $e->getMessage());
        }

    }
    
    public function update_password(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:5|confirmed',
        ]);

        try {
            $pengguna = Pengguna::finOrFail(auth()->user()->id);
            if (!Hash::check($request->current_password, $pengguna->password)) {
                return redirect("/admin/profil")->with('error_password', 'Password lama tidak sesuai.');
            }

            $pengguna->password = Hash::make($request->new_password);
            $pengguna->save();

            return redirect("/admin/profil")->with('success_password', 'Password berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect("/admin/profil")->with('error_password', 'Gagal memperbarui password: ' . $e->getMessage());
        }
    }

    public function show_profile()
    {
        return Inertia::render('Admin/Profil');
    }
}
