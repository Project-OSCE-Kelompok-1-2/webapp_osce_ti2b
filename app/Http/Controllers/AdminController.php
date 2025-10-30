<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pengguna; // Diubah dari User ke Pengguna
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

class AdminController extends Controller
{
    // --- GANTI ID '1' INI SESUAI ID PENGGUNA DI DATABASE ANDA ---
    private $testUserId = 1;
    // ----------------------------------------------------

    public function update_profile(Request $request)
    {
        $request->validate([
            'nama' => 'nullable|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            // GANTI 'auth()->user()->id' menjadi '$this->testUserId'
            $user = Pengguna::findOrFail($this->testUserId); // Diubah dari User ke Pengguna

            if ($request->hasFile('foto')) {
                // ... (Logika upload foto Anda sudah OK) ...
                $foto = $request->file('foto');
                $filename = time() . '_' . $foto->getClientOriginalName();
                $folderPath = public_path('storage/profil/admin');
                $filePath = $folderPath . '/' . $filename;

                if (!File::isDirectory($folderPath)) {
                    File::makeDirectory($folderPath, 0755, true, true);
                }
                if ($user->foto && File::exists(public_path($user->foto))) {
                    File::delete(public_path($user->foto));
                }
                $foto->move($folderPath, $filename);
                $user->foto = 'storage/profil/admin/' . $filename;
            }
            
            if ($request->filled('nama')) {
                $user->nama = $request->nama;
            }
        
            $user->save();

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
            // GANTI 'auth()->user()->id' menjadi '$this->testUserId'
            $user = Pengguna::findOrFail($this->testUserId); // Diubah dari User ke Pengguna

            if (!Hash::check($request->current_password, $user->password)) {
                return redirect("/admin/profil")->with('error_password', 'Password lama tidak sesuai.');
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return redirect("/admin/profil")->with('success_password', 'Password berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect("/admin/profil")->with('error_password', 'Gagal memperbarui password: ' . $e->getMessage());
        }
    }

    public function show_profile()
    {
        // GANTI 'auth()->user()' menjadi 'Pengguna::find(1)'
        $user = Pengguna::find($this->testUserId); // Diubah dari User ke Pengguna

        // Tambahkan cek jika user tidak ada
        if (!$user) {
            abort(404, "User testing dengan ID '{$this->testUserId}' tidak ditemukan.");
        }

        return Inertia::render('Admin/Profil', [
            'user' => [
                'nama' => $user->nama,
                'email' => $user->email,
                'foto' => $user->foto,
            ]
        ]);
    }
}
