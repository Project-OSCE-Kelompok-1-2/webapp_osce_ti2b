<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Exception;

class ProfilMahasiswaService
{
    public function updateProfile($user, array $data, ?UploadedFile $fileFoto = null)
    {
        // 1. LOGIKA FOTO (Tetap sama)
        if (isset($data['delete_foto']) && $data['delete_foto']) {
            $this->deleteFoto($user);
        } elseif ($fileFoto) {
            $this->deleteFoto($user, false);
            $fotoPath = $fileFoto->store('profilmahasiswa', 'public');
            $user->path_gambar = 'storage/' . $fotoPath;
        }

        $filledOld = !empty($data['old_password']);
        $filledNew = !empty($data['new_password']);

        if ($filledOld || $filledNew) {

            if (!$filledOld) {
                throw new Exception('Password lama wajib diisi untuk konfirmasi.');
            }

            if (!Hash::check($data['old_password'], $user->password)) {
                throw new Exception('Password lama tidak sesuai.');
            }

            if (!$filledNew) {
                throw new Exception('Silakan masukkan password baru untuk mengganti password.');
            }

            $user->password = Hash::make($data['new_password']);
        }

        if (isset($data['username'])) {
             $user->username = $data['username'];
        }

        if ($user->mahasiswa) {
            if (isset($data['nama'])) {
                $user->mahasiswa->nama = $data['nama'];
            }
            if (isset($data['nim'])) {
                $user->mahasiswa->nim = $data['nim'];
            }
            $user->mahasiswa->save();
        }

        $user->save();

        return $user;
    }

    private function deleteFoto($user, $updateDb = true)
    {
        if ($user->path_gambar) {
            $oldPath = str_replace('storage/', '', $user->path_gambar);
            Storage::disk('public')->delete($oldPath);
        }

        if ($updateDb) {
            $user->path_gambar = null;
        }
    }
}