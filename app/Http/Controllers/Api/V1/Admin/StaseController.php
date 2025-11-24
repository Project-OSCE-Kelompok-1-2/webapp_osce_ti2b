<?php

namespace App\Http\Controllers\Api\V1\Admin;


use Illuminate\Http\Request;
use App\Services\StaseService;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StaseController extends Controller
{
    protected $service;

    public function __construct(StaseService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data stase
     */
    public function index(Request $request)
    {
        try {
            $search = $request->query("search");
            $result = $this->service->getAll($search);

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
     * Membuat data stase
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_stase' => 'required|string|max:255|unique:stase,nama_stase',
                'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
                'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran',
                'deskripsi' => 'nullable|string',
            ]);

            // Tangkap data yang dikembalikan service
            $newData = $this->service->store($validated);

            return response()->json([
                'success' => true,
                'message' => 'Stase berhasil ditambahkan.',
                'data' => $newData, // Kirim data baru
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
     * Mengambil data stase
     * @param int $id_oscec
     */
    public function show($id_stase)
    {
        try {
            $stase = $this->service->getEditData($id_stase)['stase'] ?? null;

            return response()->json([
                'success' => true,
                'message' => 'Data stase ditemukan.',
                'data' => [
                    'id_stase' => $stase->id_stase,
                    'nama_stase' => $stase->nama_stase,
                    'jumlah_aspek' => $stase->aspekPenilaian()->count(),
                    // Tambahkan field lain jika diperlukan untuk detail
                    'deskripsi' => $stase->deskripsi,
                    'id_mata_kuliah' => $stase->id_mata_kuliah,
                    'id_tujuan_pembelajaran' => $stase->id_tujuan_pembelajaran,
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
     * Memperbarui data stase
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama_stase' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('stase', 'nama_stase')->ignore($id, 'id_stase'),
                ],
                'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
                'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran',
                'deskripsi' => 'nullable|string',
            ]);

            // Tangkap data yang dikembalikan service
            $updatedData = $this->service->update($validated, $id);

            return response()->json([
                'success' => true,
                'message' => 'Stase berhasil diperbarui.',
                'data' => $updatedData, // Kirim data yang sudah diupdate
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
     * Menghapus data stase
     * @param int $id_oscec
     */
    public function destroy($id_stase)
    {
        try {
            $this->service->delete($id_stase);

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
