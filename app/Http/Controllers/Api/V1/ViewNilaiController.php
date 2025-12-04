<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\NilaiOsceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class ViewNilaiController extends Controller
{
    protected $nilaiOsceService;

    // Inject Service ke dalam Controller
    public function __construct(NilaiOsceService $nilaiOsceService)
    {
        $this->nilaiOsceService = $nilaiOsceService;
    }

    /**
     * Endpoint: GET /api/v1/penilaian/{id_enrollment_osce}/view
     */
    public function __invoke($id_enrollment_osce)
    {
        try {
            // Panggil fungsi dari Service
            // Kita pass ID enrollment dan User yang sedang login
            $data = $this->nilaiOsceService->getDetailNilai($id_enrollment_osce, Auth::user());

            // Return JSON Response sukses
            return response()->json([
                'success' => true,
                'message' => 'Detail nilai berhasil diambil',
                'data'    => $data
            ], 200);

        } catch (Exception $e) {
            // Tangkap error jika ada (misal 404 not found atau 403 forbidden)
            // Menggunakan getCode() dari Exception untuk status code HTTP
            $statusCode = $e->getCode();
            
            // Pastikan status code valid (tidak 0)
            if ($statusCode < 100 || $statusCode > 599) {
                $statusCode = 500;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }
}