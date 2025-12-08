<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\Penguji\ProfilService;
use Exception;

class ProfilController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    public function show_profile()
    {
        $user = Auth::user();
        
        $user->load('penguji');

        $user->path_gambar = $user->path_gambar ? $user->path_gambar : null;

        return Inertia::render('Penguji/PengujiProfil', [
            'user' => $user, 
        ]);
    }

    public function update_account(Request $request)
    {
        $penguji = Auth::user();

        $request->validate([
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password'  => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password'  => ['nullable', 'string'], 
            'delete_foto'   => ['nullable', 'boolean'],
        ]);

        try {
            $this->profilService->updateProfile(
                $penguji, 
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