<?php

namespace App\Services\Admin;

use App\Models\Osce;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\OsceStase;
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
        // (BAGIAN INI TIDAK BERUBAH)
        $stats = [
            'total_osce' => Osce::count(),
            'total_mahasiswa' => Mahasiswa::count(),
            'total_penguji' => Penguji::count(),
        ];

        // LOGIKA 1: Notifikasi Bobot Stase
        $notifBobot = Stase::query()
            ->withSum('aspekPenilaian', 'bobot_maksimum')
            ->get()
            ->filter(function ($stase) {
                $total_bobot = $stase->aspek_penilaian_sum_bobot_maksimum ?? 0;
                return $total_bobot != 100;
            })
            ->toBase()
            ->map(function ($stase) {
                $bobot = $stase->aspek_penilaian_sum_bobot_maksimum ?? 0;
                return [
                    'id' => 'stase-bobot-' . $stase->id_stase,
                    'category' => 'STASE',
                    'title' => $stase->nama_stase,
                    'description' => "Total bobot penilaian saat ini: {$bobot}%",
                    'warning_label' => "Bobot tidak 100%",
                    'warning_color' => 'red',
                    'link' => "/admin/stase/{$stase->id_stase}/aspek-penilaian",
                ];
            });

        // LOGIKA 2: Notifikasi OSCE Belum Ada Jadwal
        $notifOsceKosong = Osce::doesntHave('osceStase')
            ->get()
            ->toBase()
            ->map(function ($osce) {
                return [
                    'id' => 'osce-empty-' . $osce->id_osce,
                    'category' => 'OSCE',
                    'title' => $osce->nama_osce,
                    'description' => "Ujian dibuat tapi belum ada stase/jadwal diatur.",
                    'warning_label' => "Belum Disetting",
                    'warning_color' => 'yellow',
                    'link' => "/admin/osce/",
                ];
            });

        // LOGIKA 3: Notifikasi OSCE Stase Tanpa Penguji
        $notifTanpaPenguji = OsceStase::with(['osce', 'stase'])
            ->whereNull('id_penguji')
            ->get()
            ->toBase()
            ->map(function ($jadwal) {
                $namaOsce = $jadwal->osce->nama_osce ?? 'OSCE';
                $namaStase = $jadwal->stase->nama_stase ?? 'Stase';
                return [
                    'id' => 'jadwal-penguji-' . $jadwal->id_osce_stase,
                    'category' => 'PENGUJI',
                    'title' => "{$namaOsce} - {$namaStase}",
                    'description' => "Jadwal tanggal " . ($jadwal->tanggal ? $jadwal->tanggal->format('d M Y') : '-') . " belum ada penguji.",
                    'warning_label' => "Penguji Kosong",
                    'warning_color' => 'red',
                    'link' => "/admin/osce/{$jadwal->id_osce}/jadwal",
                ];
            });

        // LOGIKA 4: Notifikasi OSCE Belum Ada Peserta
        $notifTanpaPeserta = Osce::has('osceStase')
            ->doesntHave('enrollmentOsce')
            ->get()
            ->toBase()
            ->map(function ($osce) {
                return [
                    'id' => 'osce-mhs-' . $osce->id_osce,
                    'category' => 'MAHASISWA',
                    'title' => $osce->nama_osce,
                    'description' => "Belum ada mahasiswa yang didaftarkan ke sesi ini.",
                    'warning_label' => "Peserta Kosong",
                    'warning_color' => 'blue',
                    'link' => "/admin/osce/{$osce->id_osce}",
                ];
            });

        $mergedNotifikasi = $notifBobot
            ->merge($notifOsceKosong)
            ->merge($notifTanpaPenguji)
            ->merge($notifTanpaPeserta)
            ->values();

        return $mergedNotifikasi;
    }

    /**
     * Menyiapkan data profil admin.
     */
    public function getProfileData($user)
    {
        $user->path_gambar = $user->path_gambar ? $user->path_gambar : null;
        return $user;
    }

    /**
     * Logika update akun (Foto & Password).
     */
    public function updateAccount(Request $request, $admin)
    {
        // ====================================================
        // 1. LOGIKA FOTO (Diadaptasi agar mirip structure Penguji)
        // ====================================================
        if ($request->boolean('delete_foto')) {
            $this->deleteFoto($admin);
        } elseif ($request->hasFile('foto')) {
            $this->deleteFoto($admin, false); // Hapus file lama fisik, jangan null-kan DB dulu

            $fotoPath = $request->file('foto')->store('profiladmin', 'public');
            $admin->path_gambar = 'storage/' . $fotoPath;
        }

        // ====================================================
        // 2. LOGIKA PASSWORD (IDENTIK DENGAN PENGUJI)
        // ====================================================

        // Deteksi input (menggunakan helper Laravel request)
        $filledOld = $request->filled('old_password');
        $filledNew = $request->filled('new_password');

        // Jika salah satu kolom password diisi
        if ($filledOld || $filledNew) {

            // A. Cek Ketersediaan Password Lama
            if (!$filledOld) {
                throw ValidationException::withMessages([
                    'old_password' => ['Password lama wajib diisi untuk konfirmasi.'],
                ]);
            }

            // B. CEK KEBENARAN PASSWORD LAMA (Prioritas Utama)
            if (!Hash::check($request->old_password, $admin->password)) {
                throw ValidationException::withMessages([
                    'old_password' => ['Password lama tidak sesuai.'],
                ]);
            }

            // C. Cek Ketersediaan Password Baru
            // Jika sampai sini, berarti password lama BENAR.
            if (!$filledNew) {
                throw ValidationException::withMessages([
                    'new_password' => ['Silakan masukkan password baru untuk mengganti password.'],
                ]);
            }

            // D. Eksekusi Ganti Password
            $admin->password = Hash::make($request->new_password);
        }

        $admin->save();

        return $admin;
    }

    /**
     * Helper private untuk hapus foto (Clean Code)
     */
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
