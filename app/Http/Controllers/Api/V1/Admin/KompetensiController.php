<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\KompetensiService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class KompetensiController extends Controller
{
    protected $service;

    public function __construct(KompetensiService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /aspek-penilaian/{id_aspek}/kompetensi
     */
    public function index(Request $request, $id_aspek)
    {
        try {
            $aspekPenilaian = AspekPenilaian::findOrFail($id_aspek);

            $paginator = $this->service->getByAspek($request, $aspekPenilaian);

            return response()->json([
                'status' => 'success',
                'data' => $paginator, // Isi data sudah ditransformasi di Service
                'filters' => $request->only(['search']),
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Aspek Penilaian tidak ditemukan.'
            ], 404);
        }
    }

    /**
     * POST /aspek-penilaian/{id_aspek}/kompetensi
     */
    public function store(Request $request, $id_aspek)
    {
        try {
            $aspekPenilaian = AspekPenilaian::findOrFail($id_aspek);

            $kompetensi = $this->service->create($request, $aspekPenilaian);

            return response()->json([
                'status' => 'success',
                'message' => 'Kompetensi berhasil ditambahkan.',
                'data' => [
                    'id_poin_aspek_penilaian' => $kompetensi->id_poin_aspek_penilaian,
                    'kompetensi' => $kompetensi->kompetensi,
                    'skor' => $kompetensi->skor,
                    'bobot' => $kompetensi->bobot
                ]
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Aspek Penilaian tidak ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /kompetensi/{id}
     */
    public function show($id)
    {
        try {
            $kompetensi = PoinAspekPenilaian::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id_poin_aspek_penilaian' => $kompetensi->id_poin_aspek_penilaian,
                    'kompetensi' => $kompetensi->kompetensi,
                    'skor' => $kompetensi->skor,
                    'bobot' => $kompetensi->bobot
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kompetensi tidak ditemukan.'
            ], 404);
        }
    }

    /**
     * PUT /kompetensi/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $kompetensi = PoinAspekPenilaian::findOrFail($id);

            $updatedData = $this->service->update($request, $kompetensi);

            return response()->json([
                'status' => 'success',
                'message' => 'Kompetensi berhasil diperbarui.',
                'data' => [
                    'id_poin_aspek_penilaian' => $updatedData->id_poin_aspek_penilaian,
                    'kompetensi' => $updatedData->kompetensi,
                    'skor' => $updatedData->skor,
                    'bobot' => $updatedData->bobot
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kompetensi tidak ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /kompetensi/{id}
     */
    public function destroy($id)
    {
        try {
            $kompetensi = PoinAspekPenilaian::findOrFail($id);

            $this->service->delete($kompetensi);

            return response()->json([
                'status' => 'success',
                'message' => 'Kompetensi berhasil dihapus.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Kompetensi tidak ditemukan.'
            ], 404);
        }
    }
}
