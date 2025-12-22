<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\ProfilMahasiswaService; 
use Exception;

class ProfilMahasiswaController extends Controller
{
    protected $profilMahasiswaService;

    public function __construct(ProfilMahasiswaService $profilMahasiswaService)
    {
        $this->profilMahasiswaService = $profilMahasiswaService;
    }

    /**
     * Menampilkan Halaman Pengaturan Akun
     */
    public function show_profile()
    {
        $user = Auth::user();

        $user->load('mahasiswa');

        return Inertia::render('Mahasiswa/PengaturanAkun', [
            'user' => $user,
        ]);
    }

    /**
     * Memproses Update Profil (Foto, Password, Data Diri)
     */
    public function update_account(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'foto'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
            'delete_foto'      => ['boolean'],
            'username'         => ['required', 'string', 'unique:pengguna,username,'.$user->id_pengguna.',id_pengguna'],
            'nama'             => ['nullable', 'string'],
            'nim'              => ['nullable', 'string'],
            'old_password'     => ['nullable', 'required_with:new_password', 'string'],
            'new_password'     => ['nullable', 'string', 'min:6', 'confirmed'],
        ], [
            'username.unique'            => 'Username sudah digunakan oleh pengguna lain.',
            'old_password.required_with' => 'Password lama wajib diisi jika ingin mengganti password.',
            'new_password.confirmed'     => 'Konfirmasi password baru tidak cocok.',
            'new_password.min'           => 'Password baru minimal 6 karakter.',
            'foto.max'                   => 'Ukuran foto maksimal 2MB.',
            'foto.image'                 => 'File harus berupa gambar.',
        ]);

        try {
            $this->profilMahasiswaService->updateProfile(
                $user, 
                $request->all(), 
                $request->file('foto')
            );

            return back()->with('success', 'Profil berhasil diperbarui!');

        } catch (Exception $e) {
            return back()->withErrors([
                'old_password' => $e->getMessage()
            ]);
        }
    }
}