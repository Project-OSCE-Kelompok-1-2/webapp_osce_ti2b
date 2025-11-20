<?php

namespace App\Http\Controllers\Api\V1;

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
     * GET /admin/dashboard
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
     * GET /admin/profile
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
     * POST /admin/profile/update
     */
    public function update_account(Request $request)
    {
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
