<?php

namespace App\Http\Controllers\Api\V1\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Penguji\HalamanPenilaianService;

class ApiHalamanPenilaian extends Controller
{
    protected $penilaianService;

    public function __construct(HalamanPenilaianService $penilaianService)
    {
        $this->penilaianService = $penilaianService;
    }

    /**
     * Mendapatkan data antrian dan detail stase
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
