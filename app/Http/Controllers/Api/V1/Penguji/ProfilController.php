<?php

namespace App\Http\Controllers\Api\V1\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\Penguji\ProfilService;
use Exception;

class ProfilController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    /**
     * Mengambil data profil penguji
     */
    public function show_profile()
    {
        $user = Auth::user();
        $user->load('penguji');

        return response()->json([
            'success' => true,
            'message' => 'Detail profil penguji',
            'data'    => [
                'id_pengguna' => $user->id_pengguna,
                'username'    => $user->username,
                'path_gambar' => $user->path_gambar,
                'nama'        => $user->penguji ? $user->penguji->nama : null,
                'nip'         => $user->penguji ? $user->penguji->nip : null,
            ]
        ], 200);
    }

    /**
     * Mengupdate data profil penguji
     */
    public function update_account(Request $request)
    {
        $penguji = Auth::user();

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
