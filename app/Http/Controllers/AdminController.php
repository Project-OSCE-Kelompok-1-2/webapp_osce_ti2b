<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;


// ... bagian use dan class AdminController ...

class AdminController extends Controller
{
    public function update_profile(Request $request)
    {
        // 1. VALIDASI DATA
        $request->validate([
            'nama' => 'nullable|max:255', 
            // PENTING: Untuk upload file melalui PUT/PATCH, Anda harus menggunakan `post`
            // Inertia secara otomatis akan mengirimkan _method:PUT/PATCH
            // Jadi, pastikan route di Laravel Anda menggunakan PUT dan method spoofing diaktifkan
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        
        // 2. CEK AUTENTIKASI DAN AMBIL RELASI ADMIN
        $pengguna = Auth::user();
        
        if (!$pengguna) {
             return redirect()->route('admin.profil.show')->with('error', 'Anda harus login untuk mengakses ini.');
        }

        $admin = $pengguna->admin;
        
        if (!$admin) {
             return redirect()->route('admin.profil.show')->with('error', 'Data profil admin tidak ditemukan untuk user ini.');
        }

        try {
            // 3. LOGIKA UPDATE
            
            if ($request->hasFile('foto')) {
                // ... (Logika upload foto sudah benar) ...
                $foto = $request->file('foto');
                
                $filename = time() . '_' . $foto->getClientOriginalName();
                $folderPath = storage_path('storage/profiladmin/');
                $dbPath = 'storage/profiladmin/' . $filename; 

                if (!File::isDirectory($folderPath)) {
                    File::makeDirectory($folderPath, 0755, true, true);
                }
                
                // Hapus foto lama
                if ($admin->foto && strpos($admin->foto, 'storage/') === 0 && File::exists(public_path($admin->foto))) {
                    File::delete(public_path($admin->foto));
                }

                $foto->move(public_path('storage/profiladmin/'), $filename); // Perbaikan: Gunakan public_path jika file diakses publik
                $admin->foto = 'storage/profiladmin/' . $filename; 
            }

            $admin->save();

            // PENTING: Gunakan redirect ke route show, dan flash message akan ditangkap di frontend
            return redirect()->route('admin.profil.show')->with('success', 'Profil berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Gagal memperbarui profil: ' . $e->getMessage());
            return redirect()->route('admin.profil.show')->with('error', 'Gagal memperbarui profil: Terjadi kesalahan server.');
        }
    }
    
    public function update_password(Request $request)
    {
         $pengguna = Auth::user();
         dd($pengguna);

         
         if (!$pengguna) {
             return redirect()->route('admin.profil.show')->with('error', 'Anda harus login untuk mengakses ini.');
         }

         $admin = $pengguna->admin; 

         if (!$admin) {
           return redirect()->route('admin.profil.show')->with('error', 'Data admin tidak ditemukan.');
         }
         
         $request->validate([
              'current_password' => 'required',
              'new_password' => 'required|min:5|confirmed',
         ]);

         try {
             if (!Hash::check($request->current_password, $admin->password)) {
                 return redirect()->route('admin.profil.show')->with('error', 'Password lama tidak sesuai.'); // Menggunakan withErrors untuk validasi field tertentu
             }

             $admin->password = Hash::make($request->new_password);
             $admin->save();

             return redirect()->route('admin.profil.show')->with('success', 'Password berhasil diperbarui.');
         } catch (\Exception $e) {
             return redirect()->route('admin.profil.show')->with('error', 'Gagal memperbarui password: ' . $e->getMessage());
         }
    }
    
     public function show_profile(Request $request)
    {
         $pengguna = Auth::user();

         if (!$pengguna) {
             // Redireksi atau tampilkan halaman error jika tidak login
             abort(403, "Akses ditolak. Anda harus login.");
         }

         $admin = $pengguna->admin;
        
         if (!$admin) {
             // Jika user ini tidak punya relasi admin
             abort(404, "Data admin tidak ditemukan untuk user ini.");
         }

         return Inertia::render('Admin/Profil', [
             'user' => [
                 'nama' => $admin->nama,
                 'email' => $admin->email,
                 'foto' => $admin->foto,
             ]
         ]);
    }
}