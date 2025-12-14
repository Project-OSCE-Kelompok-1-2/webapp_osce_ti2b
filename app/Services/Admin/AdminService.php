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
        $stats = [
            'total_osce' => Osce::count(),
            'total_mahasiswa' => Mahasiswa::count(),
            'total_penguji' => Penguji::count(),
        ];

        // =================================================================
        // LOGIKA 1: Notifikasi Bobot Stase (Belum 100%)
        // =================================================================
        $notifBobot = Stase::query()
            ->withSum('aspekPenilaian', 'bobot_maksimum')
            ->get()
            ->filter(function ($stase) {
                $total_bobot = $stase->aspek_penilaian_sum_bobot_maksimum ?? 0;
                // Anggap toleransi float, jika tidak tepat 100
                return $total_bobot != 100;
            })
            ->map(function ($stase) {
                $bobot = $stase->aspek_penilaian_sum_bobot_maksimum ?? 0;
                return [
                    'id' => 'stase-bobot-' . $stase->id_stase,
                    'category' => 'STASE',
                    'title' => $stase->nama_stase,
                    'description' => "Total bobot penilaian saat ini: {$bobot}%",
                    'warning_label' => "Bobot tidak 100%",
                    'warning_color' => 'red', 
                    'link' => "/admin/stase/",
                ];
            });

        // =================================================================
        // LOGIKA 2: Notifikasi OSCE Belum Ada Jadwal/Stase (FIX ERROR ANDA)
        // =================================================================
        // Menggunakan relasi 'osceStase' bukan 'sesi'
        $notifOsceKosong = Osce::doesntHave('osceStase')
            ->get()
            ->map(function ($osce) {
                return [
                    'id' => 'osce-empty-' . $osce->id_osce,
                    'category' => 'OSCE',
                    'title' => $osce->nama_osce,
                    'description' => "Ujian dibuat tapi belum ada stase/jadwal diatur.",
                    'warning_label' => "Belum Disetting",
                    'warning_color' => 'yellow',
                    'link' => "/admin/osce", 
                ];
            });

        // =================================================================
        // LOGIKA 3: Notifikasi OSCE Stase Tanpa Penguji
        // =================================================================
        // Kasus: Jadwal dibuat, tapi Penguji belum dipilih (id_penguji NULL)
        $notifTanpaPenguji = OsceStase::with(['osce', 'stase'])
            ->whereNull('id_penguji')
            ->get()
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
                    'link' => "/admin/osce", // Arahkan ke detail OSCE
                ];
            });

        // =================================================================
        // LOGIKA 4: Notifikasi OSCE Belum Ada Peserta (Enrollment)
        // =================================================================
        // Menggunakan relasi 'enrollmentOsce'
        $notifTanpaPeserta = Osce::has('osceStase') // Sudah disetting stase
            ->doesntHave('enrollmentOsce') // Tapi belum ada mahasiswa
            ->get()
            ->map(function ($osce) {
                return [
                    'id' => 'osce-mhs-' . $osce->id_osce,
                    'category' => 'MAHASISWA',
                    'title' => $osce->nama_osce,
                    'description' => "Belum ada mahasiswa yang didaftarkan ke sesi ini.",
                    'warning_label' => "Peserta Kosong",
                    'warning_color' => 'blue',
                    'link' => "/admin/osce",
                ];
            });

        // Gabungkan semua notifikasi
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
