<?php

namespace App\Services\Penguji;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Exception;

class ProfilService
{
    /**
     * @param mixed $user Model Pengguna (Auth::user())
     */
    public function updateProfile($user, array $data, ?UploadedFile $fileFoto = null)
    {

        // 1. LOGIKA FOTO
        if (isset($data['delete_foto']) && $data['delete_foto']) {
            $this->deleteFoto($user);
        }
        elseif ($fileFoto) {
            $this->deleteFoto($user, false);
            $fotoPath = $fileFoto->store('profilpenguji', 'public');
            $user->path_gambar = 'storage/' . $fotoPath;
        }

        // 2. LOGIKA PASSWORD
        if (!empty($data['new_password'])) {
            if (!Hash::check($data['old_password'], $user->password)) {
                throw new Exception('Password lama tidak sesuai.');
            }
            $user->password = Hash::make($data['new_password']);
        }

        // 3. UPDATE USERNAME (Opsional, jika ada di request)
        if (isset($data['username'])) {
             $user->username = $data['username'];
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