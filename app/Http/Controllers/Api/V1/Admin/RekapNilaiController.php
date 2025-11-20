<?php

namespace App\Http\Controllers\Api\V1\Admin;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\RekapNilaiService;

class RekapNilaiController extends Controller
{
    protected $service;

    public function __construct(RekapNilaiService $service)
    {
        $this->service = $service;
    }

    /**
     * List OSCE
     */
    public function index(Request $request)
    {
        $osces = $this->service->getRekapList($request);

        return response()->json([
            'status' => 'success',
            'osce' => $osces, // Struktur data sama dengan props 'osce' di Inertia
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }

    /**
     * List Sesi per OSCE
     */
    public function listSesi(Request $request, $id_osce)
    {
        $data = $this->service->getSesiList($request, $id_osce);

        return response()->json([
            'status' => 'success',
            'osce' => $data['osce'],
            'sesi' => $data['sesi'],
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * List Mahasiswa per Sesi
     */
    public function listMahasiswaPerStase(Request $request, $id_osce, $id_sesi)
    {
        $data = $this->service->getMahasiswaPerSesi($request, $id_osce, $id_sesi);

        return response()->json([
            'status' => 'success',
            'osce' => $data['osce'],
            'sesi' => $data['sesi_info'],
            'mahasiswa_list' => $data['mahasiswa_list'],
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * Detail Nilai Mahasiswa
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

        if (!$detailNilai) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data mahasiswa untuk OSCE ini tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'detailNilai' => $detailNilai
        ]);
    }
}
