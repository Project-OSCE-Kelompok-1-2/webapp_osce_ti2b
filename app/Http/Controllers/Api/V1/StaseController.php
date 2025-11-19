<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\StaseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class StaseController extends Controller
{
    protected $service;

    public function __construct(StaseService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/v1/stase
     */
    public function index(Request $request)
    {
        try {
            $result = $this->service->getAll($request);

            // $result['data'] berisi paginator yang sudah dimapping oleh service
            return response()->json([
                'success' => true,
                'message' => 'Data stase berhasil diambil.',
                'data' => $result['data'],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data stase: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * POST /api/v1/stase
     */
    public function store(Request $request)
    {
        try {
            // service akan melakukan validasi dan menyimpan
            $this->service->store($request);

            return response()->json([
                'success' => true,
                'message' => 'Stase berhasil ditambahkan.',
                'data' => null,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'data' => null,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan stase: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * GET /api/v1/stase/{id}
     */
    public function show($id)
    {
        try {
            $stase = $this->service->getEditData($id)['stase'] ?? null;

            return response()->json([
                'success' => true,
                'message' => 'Data stase ditemukan.',
                'data' => [
                    'id_stase' => $stase->id_stase,
                    'nama_stase' => $stase->nama_stase,
                    'jumlah_aspek' => $stase->aspekPenilaian()->count(),
                ],
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stase tidak ditemukan.',
                'data' => null,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil stase: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * PUT/PATCH /api/v1/stase/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $this->service->update($request, $id);

            return response()->json([
                'success' => true,
                'message' => 'Stase berhasil diperbarui.',
                'data' => null,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first(),
                'data' => null,
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stase tidak ditemukan.',
                'data' => null,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui stase: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }

    /**
     * DELETE /api/v1/stase/{id}
     */
    public function destroy($id)
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Stase berhasil dihapus.',
                'data' => null,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stase tidak ditemukan.',
                'data' => null,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus stase: ' . $e->getMessage(),
                'data' => null,
            ], 500);
        }
    }
}
