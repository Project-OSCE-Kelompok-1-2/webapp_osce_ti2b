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
        
        $user->load('mahasiswa');

        $user->path_gambar = $user->path_gambar ? $user->path_gambar : null;

        return Inertia::render('Mahasiswa/PengaturanAkun', [
            'user' => $user, 
        ]);
    }

    public function update_account(Request $request)
    {
        $mahasiswa = Auth::user();

        $request->validate([
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password'  => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password'  => ['nullable', 'string'], 
            'delete_foto'   => ['nullable', 'boolean'],
        ]);

        try {
            $this->profilmahasiswaService->updateProfile(
                $mahasiswa, 
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