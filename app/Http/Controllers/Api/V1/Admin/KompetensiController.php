<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\KompetensiService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Dedoc\Scramble\Attributes\Response;

class KompetensiController extends Controller
{
    protected $service;

    public function __construct(KompetensiService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, $id_aspek)
    {
        try {
            $aspekPenilaian = AspekPenilaian::findOrFail($id_aspek);
            $search = $request->query("search");
            $paginator = $this->service->getByAspek( $aspekPenilaian, $search);

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
     * Membuat data kompetensi
     * @param int $id_aspek
     */
    public function store(Request $request, $id_aspek)
    {
        try {
            $validated = $request->validate([
                'kompetensi' => 'required|string',
                'skor' => 'required|integer|min:0', // Ditambahkan agar sesuai output
                'bobot' => 'required|integer|min:1',
            ]);

            $aspekPenilaian = AspekPenilaian::findOrFail($id_aspek);

            $kompetensi = $this->service->create($aspekPenilaian, $validated);

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
     * Mengambil data kompetensi
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
     * Memperbarui data kompetensi
     * @param int $id_kompetensi
     */
    public function update(Request $request, $id_kompetensi)
    {
        try {
            $kompetensi = PoinAspekPenilaian::findOrFail($id_kompetensi);

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
     * Menghapus data kompetensi
     * @param int $id_kompetensi
     */
    public function destroy($id_kompetensi)
    {
        try {
            $kompetensi = PoinAspekPenilaian::findOrFail($id_kompetensi);

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
