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

        // ====================================================
        // 2. LOGIKA PASSWORD (DIPERBAIKI SESUAI REQUEST)
        // ====================================================

        // Deteksi apakah user mencoba mengutak-atik kolom password
        $filledOld = !empty($data['old_password']);
        $filledNew = !empty($data['new_password']);

        // Jika salah satu kolom password diisi, kita masuk mode validasi ketat
        if ($filledOld || $filledNew) {

            // A. Cek Ketersediaan Password Lama
            if (!$filledOld) {
                throw new Exception('Password lama wajib diisi untuk konfirmasi.');
            }

            // B. CEK KEBENARAN PASSWORD LAMA (Prioritas Utama)
            // Ini akan error duluan jika password lama salah, walau password baru kosong
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

        // 3. UPDATE USERNAME
        if (isset($data['username'])) {
             $user->username = $data['username'];
        }

        // 4. UPDATE DATA MAHASISWA
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