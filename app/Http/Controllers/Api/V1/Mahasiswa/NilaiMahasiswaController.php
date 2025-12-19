<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Mahasiswa\NilaiMahasiswaService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class NilaiMahasiswaController extends Controller
{
    protected $nilaiShowService;

    public function __construct(NilaiMahasiswaService $nilaiShowService)
    {
        $this->nilaiShowService = $nilaiShowService;
    }

    /**
     * @param int $id ID EnrollmentOsce
     */
    public function show($id)
    {
        try {
            $data = $this->nilaiShowService->getCalculatedNilaiDetail((int) $id);

            return response()->json([
                'status' => 'success',
                'data' => $data 
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Enrollment nilai tidak ditemukan.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses nilai: ' . $e->getMessage()
            ], 500);
        }
    }
}
