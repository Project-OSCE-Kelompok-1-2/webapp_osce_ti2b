<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\Stase;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\AspekPenilaianService;

class AspekPenilaianController extends Controller
{
    protected $service;

    public function __construct(AspekPenilaianService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, Stase $stase)
    {
        $data = $this->service->getByStase($request, $stase);

        return response()->json([
            'status' => 'success',
            'stase' => $stase,
            'data' => $data,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request, Stase $stase)
    {
        $aspek = $this->service->create($request, $stase);

        return response()->json([
            'status' => 'success',
            'message' => 'Aspek Penilaian berhasil ditambahkan.',
            'data' => $aspek
        ], 201);
    }

    // --- BAGIAN YANG WAJIB DIUBAH ---

    // 1. Tambahkan Stase $stase sebagai parameter pertama
    public function show(Stase $stase, AspekPenilaian $aspekPenilaian)
    {
        // (Optional) Validasi parent: Pastikan aspek ini benar milik stase tersebut
        if ($aspekPenilaian->id_stase !== $stase->id_stase) {
            abort(404, 'Data tidak ditemukan di stase ini.');
        }

        return response()->json([
            'status' => 'success',
            'data' => $aspekPenilaian
        ]);
    }

    // 2. Tambahkan Stase $stase sebelum AspekPenilaian
    // Urutan: Request -> Parent (Stase) -> Child (AspekPenilaian)
    public function update(Request $request, Stase $stase, AspekPenilaian $aspekPenilaian)
    {
        // Validasi parent
        if ($aspekPenilaian->id_stase !== $stase->id_stase) {
            abort(404);
        }

        // Panggil service (Service tidak butuh $stase, jadi kirim request & aspek saja)
        $updatedAspek = $this->service->update($request, $aspekPenilaian);

        return response()->json([
            'status' => 'success',
            'message' => 'Aspek Penilaian berhasil diperbarui.',
            'data' => $updatedAspek
        ]);
    }

    // 3. Tambahkan Stase $stase
    public function destroy(Stase $stase, AspekPenilaian $aspekPenilaian)
    {
        // Validasi parent
        if ($aspekPenilaian->id_stase !== $stase->id_stase) {
            abort(404);
        }

        $this->service->delete($aspekPenilaian);

        return response()->json([
            'status' => 'success',
            'message' => 'Aspek penilaian berhasil dihapus.'
        ]);
    }
}
