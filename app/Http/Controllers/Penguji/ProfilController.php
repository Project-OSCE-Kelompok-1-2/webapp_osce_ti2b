<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Osce;
use App\Models\Mahasiswa;
use App\Models\Penguji;
use App\Models\Stase;
use Illuminate\Validation\Rule; // Import ini untuk validasi unik

class ProfilController extends Controller
{
    public function show_profile()
    {
        $penguji = Auth::user();

        // Sesuaikan dengan model Anda: gunakan 'path_gambar'
        $penguji->path_gambar = $penguji->path_gambar ? ($penguji->path_gambar) : null;

        return Inertia::render('Penguji/PengaturanAkun', [
            // Kirim 'user' ke props 'user' di frontend
            'user' => $penguji, 
        ]);
    }

    /**
     * 🔹 [FUNGSI BARU] Update Akun (Profil DAN/ATAU Password)
     * Ini adalah satu-satunya fungsi yang dipanggil oleh tombol "Simpan"
     */
    public function update_account(Request $request)
    {
        $penguji = Auth::user();

        // --- Validasi ---
        // Kita validasi semua input yang mungkin
        $request->validate([
            // Data Profil
            // (Sesuai Pengguna.php: 'username' dan 'path_gambar')
            // 'username' => [
            //     'required', 
            //     'string', 
            //     'max:255',
            //     // Pastikan username unik, KECUALI untuk diri sendiri
            //     Rule::unique('pengguna', 'username')->ignore($penguji->id_pengguna, 'id_pengguna')
            // ],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'], // 1MB Sesuai UI

            // Data Password (HANYA JIKA diisi)
            // 'confirmed' akan cek 'new_password_confirmation'
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password' => ['nullable', 'string'],
            'delete_foto' => ['nullable', 'boolean'],
        ]);

        // --- Logika Update Profil ---
        // (Selalu update username & foto jika ada)

        // 1. Update Username
        // $penguji->username = $request->username;

        // --- LOGIKA FOTO DIPERBARUI ---
        // Cek apakah frontend mengirim 'delete_foto: true'
        if ($request->boolean('delete_foto')) {
            // 1. HAPUS FOTO
            if ($penguji->path_gambar) {
                $oldPath = str_replace('storage/', '', $penguji->path_gambar);
                Storage::disk('public')->delete($oldPath);
            }
            $penguji->path_gambar = null; // Set 'path_gambar' di DB menjadi null
        }
        // 2. Update Foto (jika ada file baru)
        elseif ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($penguji->path_gambar) {
                $oldPath = str_replace('storage/', '', $penguji->path_gambar);
                Storage::disk('public')->delete($oldPath);
            }
            // Simpan foto baru
            $fotoPath = $request->file('foto')->store('profilpenguji', 'public');
            $penguji->path_gambar = 'storage/' . $fotoPath;
        }

        // --- Logika Update Password ---
        
        // Cek JIKA pengguna MENGISI field password baru
        if ($request->filled('new_password')) {
            
            // Jika password baru diisi, password lama WAJIB benar
            if (!Hash::check($request->old_password, $penguji->password)) {
                // Kirim error HANYA untuk field old_password
                return back()->withErrors([
                    'old_password' => 'Password lama tidak sesuai.',
                ]);
            }
            
            // 3. Update Password
            // (Model Pengguna.php Anda sudah punya 'password' => 'hashed' cast,
            // jadi kita bisa langsung set nilainya)
            $penguji->password = $request->new_password;
        }
        
        // Simpan semua perubahan (username, foto, dan/atau password)
        $penguji->save();

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}