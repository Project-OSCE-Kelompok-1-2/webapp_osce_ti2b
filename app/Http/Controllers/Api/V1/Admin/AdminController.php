<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Osce;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\Admin\AdminService;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    protected $service;

    public function __construct(AdminService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil data dashboard admin
     */
    public function dashboard()
    {
        $notifikasi = $this->service->getDashboardData();

        $stats = [
            'total_osce' => Osce::count(),
            'total_mahasiswa' => Mahasiswa::count(),
            'total_penguji' => Penguji::count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => ["stats" => $stats, "notifikasi" => $notifikasi],
        ]);
    }

    /**
     * Mengambil data admin
     */
    public function show_profile()
    {
        $user = Auth::user();
        $data = $this->service->getProfileData($user);

        return response()->json([
            'status' => 'success',
            'user' => $data,
        ]);
    }

    /**
     * Memperbarui data admin
     */
    public function update_account(Request $request)
    {
        $request->validate([
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password' => ['nullable', 'string'],
            'delete_foto' => ['nullable', 'boolean'],
        ]);

        $user = Auth::user();
        Log::info("data_user" . $user);

        $updatedUser = $this->service->updateAccount($request, $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui!',
            'user' => $updatedUser,
        ]);
    }
}
