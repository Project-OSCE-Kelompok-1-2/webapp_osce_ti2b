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
    protected $profilmahasiswaService;

    public function __construct(ProfilMahasiswaService $profilmahasiswaService)
    {
        $this->profilmahasiswaService = $profilmahasiswaService;
    }

    public function show_profile()
    {
        $user = Auth::user();
        
        // Pastikan relasi mahasiswa dimuat agar frontend bisa akses user.mahasiswa.nama & nim
        $user->load('mahasiswa');

        return Inertia::render('Mahasiswa/PengaturanAkun', [
            'user' => $user, 
        ]);
    }

    public function update_account(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:5120'], // Max 5MB
            'new_password'  => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password'  => ['nullable', 'required_with:new_password', 'string'], 
            'delete_foto'   => ['nullable', 'boolean'],
            'username'      => ['nullable', 'string', 'unique:pengguna,username,'.$user->id_pengguna.',id_pengguna'],
            'nama'          => ['nullable', 'string'],
            'nim'           => ['nullable', 'string'],
        ]);

        try {
            $this->profilmahasiswaService->updateProfile(
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