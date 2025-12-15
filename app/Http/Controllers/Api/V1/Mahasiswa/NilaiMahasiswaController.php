<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Mahasiswa\NilaiMahasiswaService; // Service baru
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class NilaiMahasiswaController extends Controller
{
    protected $nilaiShowService;

    // Dependency Injection Service
    public function __construct(NilaiMahasiswaService $nilaiShowService)
    {
        $this->nilaiShowService = $nilaiShowService;
    }

    /**
     * Menampilkan detail nilai satu enrollment (untuk API).
     * @param int $id ID EnrollmentOsce
     */
    public function show($id)
    {
        try {
            // Panggil service untuk mendapatkan data yang sudah dihitung dan diformat
            $data = $this->nilaiShowService->getCalculatedNilaiDetail((int) $id);

            // Mengembalikan JSON response
            return response()->json([
                'status' => 'success',
                'data' => $data // Data sudah sesuai dengan struktur Inertia lama (header, daftar_nilai, footer)
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
