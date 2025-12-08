<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ProfilMahasiswaService;
use App\Services\Penguji\ProfilService;
use Exception;

class ProfilMahasiswaController extends Controller
{
    protected $profilmahasiswaService;

    public function __construct(ProfilMahasiswaService $profilmahasiswaService)
    {
        $this->profilmahasiswaService = $profilmahasiswaService;
    }

    /**
     * API: Get Profile Data
     */
    public function show_profile()
    {
        $user = Auth::user();
        $user->load('mahasiswa');

        return response()->json([
        'success' => true,
        'message' => 'Detail profil mahasiswa',
        'data'    => [
            'id_pengguna' => $user->id_pengguna,
            'username'    => $user->username,
            'path_gambar' => $user->path_gambar,
            'nama'        => $user->mahasiswa ? $user->mahasiswa->nama : null,
            'nim'         => $user->mahasiswa ? $user->mahasiswa->nim : null,
            'kelas'       => $user->mahasiswa ? $user->mahasiswa->kelas : null,
            'prodi'       => $user->mahasiswa ? $user->mahasiswa->prodi : null,
            'status'      => $user->mahasiswa ? $user->mahasiswa->status : null,
        ]
    ], 200);
    }

    /**
     * API: Update Profile
     */
    public function update_account(Request $request)
    {
        $mahasiswa = Auth::user();

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
            $updatedmahasiswa = $this->profilmahasiswaService->updateProfile(
                $mahasiswa, 
                $request->all(), 
                $request->file('foto')
            );

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data'    => $updatedmahasiswa
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