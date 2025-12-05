<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Services\AdminService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule; // Import ini untuk validasi unik

class AdminController extends Controller
{
    protected $service;
    public function __construct(AdminService $service)
    {
        $this->service = $service;
    }

    public function dashboard()
    {
        $stats = [
            'total_osce' => Osce::count(),
            'total_mahasiswa' => Mahasiswa::count(),
            'total_penguji' => Penguji::count(),
        ];

        $notifikasi_bobot = $this->service->getDashboardData();

        // 3. Kirim data ke view
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'notifikasi' => $notifikasi_bobot,
        ]);
    }
    /**
     * 🔹 Menampilkan halaman profil admin
     * (Fungsi ini tetap sama)
     */
    public function show_profile()
    {
        $admin = Auth::user();

        // Sesuaikan dengan model Anda: gunakan 'path_gambar'
        $admin = $this->service->getProfileData($admin);

        return Inertia::render('Admin/PengaturanAkun', [
            // Kirim 'user' ke props 'user' di frontend
            'user' => $admin,
        ]);
    }

    /**
     * 🔹 [FUNGSI BARU] Update Akun (Profil DAN/ATAU Password)
     * Ini adalah satu-satunya fungsi yang dipanggil oleh tombol "Simpan"
     */
    public function update_account(Request $request)
    {
        $admin = Auth::user();

        // --- Validasi ---
        // Kita validasi semua input yang mungkin
        $request->validate([
            // Data Profil
            // (Sesuai Pengguna.php: 'username' dan 'path_gambar')
            // 'username' => [
            //     'required', 
            //     'string', 
            //     'max:255',
            //     // Pastikan username unik, KECUALI untuk diri sendiri
            //     Rule::unique('pengguna', 'username')->ignore($admin->id_pengguna, 'id_pengguna')
            // ],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'], // 1MB Sesuai UI

            // Data Password (HANYA JIKA diisi)
            // 'confirmed' akan cek 'new_password_confirmation'
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password' => ['nullable', 'string'],
            'delete_foto' => ['nullable', 'boolean'],
        ]);

        $this->service->updateAccount($request, $admin);
        // Simpan semua perubahan (username, foto, dan/atau password)
        $admin->save();

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
