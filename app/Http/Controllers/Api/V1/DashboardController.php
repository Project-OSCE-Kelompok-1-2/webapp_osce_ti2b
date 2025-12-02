<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    protected $dashboardService;

    /**
     * Inject Service melalui constructor
     */
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function __invoke(Request $request)
    {
        $user = Auth::user();

        // Panggil logika dari service
        $data = $this->dashboardService->getDashboardData($user);

        // Kembalikan response dalam format JSON standard
        return response()->json([
            'success' => true,
            'message' => 'Data dashboard penguji berhasil diambil',
            'data'    => $data
        ]);
    }
}