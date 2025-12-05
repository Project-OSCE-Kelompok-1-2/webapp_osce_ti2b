<?php

namespace App\Http\Controllers\Api\V1\Admin;


use Illuminate\Http\Request;
use App\Services\AdminService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
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
        $data = $this->service->getDashboardData();

        return response()->json([
            'status' => 'success',
            'stats' => $data['stats'],
            'notifikasi' => $data['notifikasi'],
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
        // Validasi
        $request->validate([
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:1024'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'old_password' => ['nullable', 'string'],
            'delete_foto' => ['nullable', 'boolean'],
        ]);

        $user = Auth::user();
        Log::info("data_user". $user);

        // Service akan menangani validasi & throw exception jika gagal
        $updatedUser = $this->service->updateAccount($request, $user);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui!',
            'user' => $updatedUser,
        ]);
    }
}
