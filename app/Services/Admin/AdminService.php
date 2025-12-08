<?php

namespace App\Services\Admin;

use App\Models\Osce;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AdminService
{
    /**
     * Mengambil data statistik dan notifikasi bobot untuk Dashboard.
     */
    public function getDashboardData()
    {
        $stats = [
            'total_osce' => Osce::count(),
            'total_mahasiswa' => Mahasiswa::count(),
            'total_penguji' => Penguji::count(),
        ];

        $notifikasi_bobot = Stase::query()
            ->with('aspekPenilaian')
            ->withSum('aspekPenilaian', 'bobot_maksimum')
            ->get()
            ->filter(function ($stase) {
                $total_bobot = $stase->aspek_penilaian_sum_bobot_maksimum ?? 0;
                return $total_bobot != 100;
            })
            ->map(function ($stase) {
                $first_aspek = $stase->aspekPenilaian->first();
                $sub_judul = $first_aspek ? $first_aspek->aspek : 'Bobot belum diatur';

                return [
                    'id_stase' => $stase->id_stase,
                    'nama_stase' => $stase->nama_stase,
                    'sub_judul' => $sub_judul,
                    'total_bobot' => $stase->aspek_penilaian_sum_bobot_maksimum ?? 0,
                ];
            })
            ->values(); // Reset keys agar jadi array JSON yang rapi

        return [
            'stats' => $stats,
            'notifikasi' => $notifikasi_bobot,
        ];
    }

    /**
     * Menyiapkan data profil admin.
     */
    public function getProfileData($user)
    {
        // Logika path gambar
        $user->path_gambar = $user->path_gambar ? $user->path_gambar : null;

        return $user;
    }

    /**
     * Logika update akun (Foto & Password).
     */
    public function updateAccount(Request $request, $admin)
    {
        // Logika Foto
        if ($request->boolean('delete_foto')) {
            // Hapus foto lama
            if ($admin->path_gambar) {
                $oldPath = str_replace('storage/', '', $admin->path_gambar);
                Storage::disk('public')->delete($oldPath);
            }
            $admin->path_gambar = null;
        } elseif ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($admin->path_gambar) {
                $oldPath = str_replace('storage/', '', $admin->path_gambar);
                Storage::disk('public')->delete($oldPath);
            }
            // Simpan foto baru
            $fotoPath = $request->file('foto')->store('profiladmin', 'public');
            $admin->path_gambar = 'storage/' . $fotoPath;
        }

        // Logika Password
        if ($request->filled('new_password')) {
            // Cek password lama
            if (!Hash::check($request->old_password, $admin->password)) {
                // Lempar exception validasi agar ditangkap sebagai error 422 oleh Laravel
                throw ValidationException::withMessages([
                    'old_password' => ['Password lama tidak sesuai.'],
                ]);
            }

            $admin->password = $request->new_password;
        }

        $admin->save();

        return $admin;
    }
}
