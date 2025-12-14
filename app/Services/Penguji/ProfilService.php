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

        // ====================================================
        // 2. LOGIKA PASSWORD (DIPERBAIKI)
        // ====================================================

        // Deteksi apakah user mencoba mengutak-atik kolom password
        $filledOld = !empty($data['old_password']);
        $filledNew = !empty($data['new_password']);

        // Jika salah satu kolom password diisi
        if ($filledOld || $filledNew) {

            // A. Cek Ketersediaan Password Lama
            if (!$filledOld) {
                throw new Exception('Password lama wajib diisi untuk konfirmasi.');
            }

            // B. CEK KEBENARAN PASSWORD LAMA (Prioritas Utama)
            // Sistem akan error disini jika password lama salah, 
            // meskipun password baru belum diisi.
            if (!Hash::check($data['old_password'], $user->password)) {
                throw new Exception('Password lama tidak sesuai.');
            }

            // C. Cek Ketersediaan Password Baru
            // Jika sampai sini, berarti password lama BENAR. Sekarang cek password baru.
            if (!$filledNew) {
                throw new Exception('Silakan masukkan password baru untuk mengganti password.');
            }

            // D. Eksekusi Ganti Password
            $user->password = Hash::make($data['new_password']);
        }
        // ====================================================

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