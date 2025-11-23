<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\Stase;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\AspekPenilaianService;
use Illuminate\Database\Eloquent\ModelNotFoundException; // Tambahkan ini

class AspekPenilaianController extends Controller
{
    protected $service;

    public function __construct(AspekPenilaianService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data aspek penilaian
     */
    public function index(Request $request, Stase $stase)
    {
        // Stase tetap pakai binding karena jarang error 404 di parent resource
        // Tapi jika stase salah ID, tetap akan default error. 
        // Kalau mau custom juga, ubah 'Stase $stase' jadi '$staseId' dan cari manual.

        $paginator = $this->service->getByStase($request, $stase);

        return response()->json([
            'status' => 'success',
            'data' => $paginator,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Membuat data aspek penilaian
     */
    public function store(Request $request, Stase $stase)
    {
        // Try-catch untuk menangkap error validasi atau database saat create
        try {
            $aspekData = $this->service->create($request, $stase);

            return response()->json([
                'status' => 'success',
                'message' => 'Aspek Penilaian berhasil ditambahkan.',
                'data' => $aspekData
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil data aspek penilaian
     */
    public function show(Stase $stase, $id)
    {
        try {
            // Cari manual di sini agar bisa ditangkap try-catch
            $aspekPenilaian = AspekPenilaian::findOrFail($id);

            if ($aspekPenilaian->id_stase !== $stase->id_stase) {
                return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan di stase ini.'], 404);
            }

            $aspekPenilaian->loadCount('poinAspekPenilaian as jumlah_kompetensi');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id_aspek_penilaian' => $aspekPenilaian->id_aspek_penilaian,
                    'aspek' => $aspekPenilaian->aspek,
                    'bobot_maksimum' => $aspekPenilaian->bobot_maksimum,
                    'jumlah_kompetensi' => $aspekPenilaian->jumlah_kompetensi,
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data Aspek Penilaian tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Mempebarui data aspek penilaian
     */
    public function update(Request $request, Stase $stase, $id)
    {
        try {
            $aspekPenilaian = AspekPenilaian::findOrFail($id);

            if ($aspekPenilaian->id_stase !== $stase->id_stase) {
                return response()->json(['status' => 'error', 'message' => 'Data tidak sinkron.'], 404);
            }

            $updatedAspekData = $this->service->update($request, $aspekPenilaian);

            return response()->json([
                'status' => 'success',
                'message' => 'Aspek Penilaian berhasil diperbarui.',
                'data' => $updatedAspekData
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan, gagal update.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server.'
            ], 500);
        }
    }

    /**
     * Menghapus data aspek penilaian
     */
    public function destroy(Stase $stase, $id)
    {
        try {
            $aspekPenilaian = AspekPenilaian::findOrFail($id);

            if ($aspekPenilaian->id_stase !== $stase->id_stase) {
                return response()->json(['status' => 'error', 'message' => 'Data tidak sinkron.'], 404);
            }

            $this->service->delete($aspekPenilaian);

            return response()->json([
                'status' => 'success',
                'message' => 'Aspek penilaian berhasil dihapus.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan, gagal hapus.'
            ], 404);
        }
    }
}
