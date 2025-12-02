<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MahasiswaService;

class MahasiswaController extends Controller
{
    protected $mahasiswaService;

    public function __construct(MahasiswaService $mahasiswaService)
    {
        $this->mahasiswaService = $mahasiswaService;
    }

    /**
     * Endpoint API untuk import data mahasiswa.
     * POST /api/admin/mahasiswa/import
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        // 1. Validasi Input (Sama persis dengan logika sebelumnya)
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        try {
            // 2. Panggil Service untuk eksekusi logika import
            $this->mahasiswaService->importMahasiswa($request->file('file'));

            // 3. Return Success JSON
            return response()->json([
                'status'  => 'success',
                'message' => 'Data mahasiswa berhasil diimpor.',
            ], 200);
        } catch (\Exception $e) {
            // 4. Return Error JSON jika import gagal
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengimpor data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
