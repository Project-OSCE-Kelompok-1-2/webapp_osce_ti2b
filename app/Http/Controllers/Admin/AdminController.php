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

        $notifikasi_bobot = $this->service->getDashboardData();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'notifikasi' => $notifikasi_bobot,
            'user' => Auth::user(), // ✅ PERBAIKAN
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
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password' => ['nullable', 'string'],
            'delete_foto' => ['nullable', 'boolean'],
        ]);

        $this->service->updateAccount($request, $admin);
        $admin->save();

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
