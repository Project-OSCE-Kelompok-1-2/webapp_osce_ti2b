<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Services\MahasiswaService;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class MahasiswaController extends Controller
{
    protected $service;

    public function __construct(MahasiswaService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data mahasiswa
     */
    public function index(Request $request)
    {
        $mahasiswa = $this->service->getAll($request);

        return response()->json([
            'status' => 'success',
            'data' => $mahasiswa,
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * Membuat data mahasiswa
     */
    public function store(Request $request)
    {
        $mahasiswa = $this->service->store($request);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahasiswa baru berhasil ditambahkan.',
            'data' => $mahasiswa
        ], 201);
    }

    /**
     * Mengambil data mahasiswa
     */
    public function show(Mahasiswa $mahasiswa)
    {
        $data = $this->service->getOne($mahasiswa);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * Memperbarui data mahasiswa
     */
    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $updatedMahasiswa = $this->service->update($request, $mahasiswa);

        return response()->json([
            'status' => 'success',
            'message' => 'Data mahasiswa berhasil diperbarui.',
            'data' => $updatedMahasiswa
        ]);
    }

    /**
     * Menghapus data mahasiswa
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $this->service->delete($mahasiswa);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahasiswa berhasil dihapus.'
        ]);
    }

    /**
     * Mengimport data mahasiswa lewat excel
     */
    public function import(Request $request)
    {
        try {
            $this->service->importExcel($request);

            return response()->json([
                'status' => 'success',
                'message' => 'Data mahasiswa berhasil diimpor.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengimpor data: ' . $e->getMessage()
            ], 500);
        }
    }
}
