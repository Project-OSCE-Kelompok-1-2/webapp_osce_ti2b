<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Services\Admin\AdminService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

        // Service sekarang mengembalikan Collection notifikasi yang sudah digabung
        $notifikasi = $this->service->getDashboardData();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'notifikasi' => $notifikasi, // Kirim data yang sudah distandarisasi
            'user' => Auth::user(),
        ]);
    }

    public function show_profile()
    {
        $admin = Auth::user();
        $admin = $this->service->getProfileData($admin);

        return Inertia::render('Admin/PengaturanAkun', [
            'user' => $admin,
        ]);
    }

    public function update_account(Request $request)
    {
        $admin = Auth::user();

        $request->validate([
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            
            // PERBAIKAN: Tambahkan 'required_with'
            'old_password' => [
                'nullable', 
                'string',
                'required_with:new_password' // Wajib jika new_password ada isinya
            ],
            'new_password' => [
                'nullable', 
                'string', 
                'min:6', 
                'confirmed',
                'required_with:old_password' // Wajib jika old_password ada isinya
            ],
            
            'delete_foto' => ['nullable', 'boolean'],
        ], [
            // Custom messages (Opsional)
            'old_password.required_with' => 'Password lama wajib diisi jika ingin mengganti password.',
            'new_password.required_with' => 'Password baru wajib diisi.',
        ]);

        $this->service->updateAccount($request, $admin);
        $admin->save();

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
