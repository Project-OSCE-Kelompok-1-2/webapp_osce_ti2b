<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\ProfilService; // Import Service
use Exception;

class ProfilController extends Controller
{
    protected $profilService;

    // Inject Service melalui Constructor
    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    public function show_profile()
    {
        $penguji = Auth::user();
        
        // Pastikan path gambar valid (defensif)
        $penguji->path_gambar = $penguji->path_gambar ? $penguji->path_gambar : null;

        return Inertia::render('Penguji/PengaturanAkun', [
            'user' => $penguji, 
        ]);
    }

    public function update_account(Request $request)
    {
        $penguji = Auth::user();

        // Validasi Input
        $request->validate([
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password'  => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password'  => ['nullable', 'string'], // Wajib diisi logic-nya jika new_password ada (dihandle service)
            'delete_foto'   => ['nullable', 'boolean'],
        ]);

        try {
            // Panggil Service untuk eksekusi update
            $this->profilService->updateProfile(
                $penguji, 
                $request->all(), 
                $request->file('foto')
            );

            return back()->with('success', 'Profil berhasil diperbarui!');

        } catch (Exception $e) {
            // Tangkap error dari Service (misal password salah)
            // Dan kembalikan error tersebut ke field 'old_password'
            return back()->withErrors([
                'old_password' => $e->getMessage()
            ]);
        }
    }
}