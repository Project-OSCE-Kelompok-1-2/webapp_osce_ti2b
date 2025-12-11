<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\ProfilMahasiswaService; // Import Service Anda
use Exception;

class ProfilMahasiswaController extends Controller
{
    protected $profilMahasiswaService;

    // Dependency Injection Service
    public function __construct(ProfilMahasiswaService $profilMahasiswaService)
    {
        $this->profilMahasiswaService = $profilMahasiswaService;
    }

    /**
     * Menampilkan Halaman Pengaturan Akun
     */
    public function show_profile()
    {
        $user = Auth::user();

        // Eager Load relasi 'mahasiswa' agar di React bisa akses: user.mahasiswa.nama
        $user->load('mahasiswa');

        // Pastikan nama file React sesuai lokasi Anda (misal: Mahasiswa/AccountSettings)
        // Sesuaikan string 'Mahasiswa/PengaturanAkun' dengan nama file .jsx Anda
        return Inertia::render('Mahasiswa/PengaturanAkun', [
            'user' => $user,
        ]);
    }

    /**
     * Memproses Update Profil (Foto, Password, Data Diri)
     */
    public function update_account(Request $request)
    {
        $user = Auth::user();

        // 1. Validasi Input dari Frontend
        $request->validate([
            'foto'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'], // Max 2MB
            'delete_foto'      => ['boolean'],
            'username'         => ['required', 'string', 'unique:pengguna,username,'.$user->id_pengguna.',id_pengguna'],
            'nama'             => ['nullable', 'string'],
            'nim'              => ['nullable', 'string'],
            // Validasi Password
            'old_password'     => ['nullable', 'required_with:new_password', 'string'],
            'new_password'     => ['nullable', 'string', 'min:6', 'confirmed'],
        ], [
            'username.unique'            => 'Username sudah digunakan oleh pengguna lain.',
            'old_password.required_with' => 'Password lama wajib diisi jika ingin mengganti password.',
            'new_password.confirmed'     => 'Konfirmasi password baru tidak cocok.',
            'new_password.min'           => 'Password baru minimal 6 karakter.',
            'foto.max'                   => 'Ukuran foto maksimal 2MB.',
            'foto.image'                 => 'File harus berupa gambar.',
        ]);

        try {
            // 2. Panggil Service untuk memproses logika
            // Kita kirim $request->all() dan file foto secara terpisah sesuai parameter service
            $this->profilMahasiswaService->updateProfile(
                $user, 
                $request->all(), 
                $request->file('foto') // Mengirim object UploadedFile atau null
            );

            // 3. Sukses -> Kembali dengan Flash Message
            return back()->with('success', 'Profil berhasil diperbarui!');

        } catch (Exception $e) {
            // 4. Gagal (Misal Password Lama Salah dari Service)
            // Kita kembalikan error spesifik ke field 'old_password' agar merah di inputnya
            return back()->withErrors([
                'old_password' => $e->getMessage()
            ]);
        }
    }
}