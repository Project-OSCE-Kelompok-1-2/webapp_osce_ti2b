<?php

namespace App\Http\Controllers\Api\v1\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\Mahasiswa\MahasiswaDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardMahasiswaController extends Controller
{
    protected $dashboardService;

    public function __construct(MahasiswaDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        // Asumsi menggunakan Sanctum/Passport untuk Auth API
        $user = Auth::user();

        // Cek relation mahasiswa
        if (!$user || !$user->mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Data mahasiswa tidak ditemukan.'
            ], 404);
        }

        $idMahasiswa = $user->mahasiswa->id_mahasiswa;

        try {
            // Reuse logic dari Service
            $statistik = $this->dashboardService->getStatistik($idMahasiswa);
            $kalenderEvent = $this->dashboardService->getCalendarEvents($idMahasiswa);
            $jadwalPenting = $this->dashboardService->getJadwalPenting($idMahasiswa, $request->date);

            return response()->json([
                'success' => true,
                'data' => [
                    'statistik' => $statistik,
                    'kalender'  => $kalenderEvent,
                    'jadwal'    => $jadwalPenting,
                    'filter'    => [
                        'date' => $request->date
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}
