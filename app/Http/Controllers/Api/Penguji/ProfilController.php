<?php

namespace App\Http\Controllers\Api\Penguji; // <--- PERHATIKAN INI HARUS ADA 'Api'

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ProfilService;
use Exception;

class ProfilController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    /**
     * API: Get Profile Data
     */
    public function show_profile()
    {
        $penguji = Auth::user();

        return response()->json([
            'success' => true,
            'message' => 'Detail profil penguji',
            'data'    => $penguji
        ], 200);
    }

    /**
     * API: Update Profile
     */
    public function update_account(Request $request)
    {
        $penguji = Auth::user();

        // Validasi
        $validator = \Validator::make($request->all(), [
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password'  => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password'  => ['nullable', 'required_with:new_password', 'string'],
            'delete_foto'   => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $updatedPenguji = $this->profilService->updateProfile(
                $penguji, 
                $request->all(), 
                $request->file('foto')
            );

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data'    => $updatedPenguji
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui profil',
                'errors'  => [
                    'old_password' => [$e->getMessage()]
                ]
            ], 400);
        }
    }
}