<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\HalamanPenilaianService;

class ApiHalamanPenilaian extends Controller
{
    protected $penilaianService;

    public function __construct(HalamanPenilaianService $penilaianService)
    {
        $this->penilaianService = $penilaianService;
    }

    /**
     * Endpoint API untuk mendapatkan antrian
     * GET /api/penguji/antrian/{id_osce}/{id_osce_stase}
     */
    public function getAntrian($id_osce, $id_osce_stase)
    {
        // Panggil service untuk logika bisnis
        $data = $this->penilaianService->getAntrianData($id_osce, $id_osce_stase);

        // Return JSON Response
        return response()->json([
            'status' => 'success',
            'data'   => $data
        ], 200);
    }

    /**
     * Endpoint API untuk mendapatkan detail penilaian
     * GET /api/penguji/penilaian/{id_enrollment_osce}
     */
    public function getPenilaian($id_enrollment_osce)
    {
        // Panggil service untuk logika bisnis
        $data = $this->penilaianService->getPenilaianData($id_enrollment_osce);

        // Return JSON Response
        return response()->json([
            'status' => 'success',
            'data'   => $data
        ], 200);
    }
}
