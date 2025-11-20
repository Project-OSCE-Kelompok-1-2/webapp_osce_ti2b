<?php

namespace App\Http\Controllers\Api\V1\Admin;


use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\KompetensiService;

class KompetensiController extends Controller
{
    protected $service;

    public function __construct(KompetensiService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /aspek-penilaian/{aspek}/kompetensi
     */
    public function index(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $data = $this->service->getByAspek($request, $aspekPenilaian);

        return response()->json([
            'status' => 'success',
            'data' => $data['kompetensi'],
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * POST /aspek-penilaian/{aspek}/kompetensi
     */
    public function store(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $kompetensi = $this->service->create($request, $aspekPenilaian);

        return response()->json([
            'status' => 'success',
            'message' => 'Kompetensi berhasil ditambahkan.',
            'data' => $kompetensi
        ], 201);
    }

    /**
     * GET /kompetensi/{kompetensi}
     * (Opsional: setara dengan fungsi edit di controller lama, untuk mengambil data detail)
     */
    public function show(PoinAspekPenilaian $kompetensi)
    {
        $data = $this->service->getOne($kompetensi);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * PUT /kompetensi/{kompetensi}
     */
    public function update(Request $request, PoinAspekPenilaian $kompetensi)
    {
        $updatedData = $this->service->update($request, $kompetensi);

        return response()->json([
            'status' => 'success',
            'message' => 'Kompetensi berhasil diperbarui.',
            'data' => $updatedData
        ]);
    }

    /**
     * DELETE /kompetensi/{kompetensi}
     */
    public function destroy(PoinAspekPenilaian $kompetensi)
    {
        $this->service->delete($kompetensi);

        return response()->json([
            'status' => 'success',
            'message' => 'Kompetensi berhasil dihapus.'
        ]);
    }
}
