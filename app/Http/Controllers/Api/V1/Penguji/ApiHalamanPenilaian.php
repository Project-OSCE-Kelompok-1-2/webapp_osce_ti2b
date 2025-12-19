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
        $data = $this->penilaianService->getAntrianData($id_osce, $id_osce_stase);

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
        $data = $this->penilaianService->getPenilaianData($id_enrollment_osce);

        return response()->json([
            'status' => 'success',
            'data'   => $data
        ], 200);
    }
}
