<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\JsonResponse;


use App\Http\Controllers\Controller;
use App\Services\OsceEnrollmentService;
use Illuminate\Http\Request;

class OsceEnrollmentController extends Controller
{
    protected $service;

    public function __construct(OsceEnrollmentService $service)
    {
        $this->service = $service;
    }

    /**
     * Menampilkan daftar mahasiswa dan status enrollment

     */
    public function index(Request $request, $osce_id, $jadwal_id)
    {
        $result = $this->service->getEnrollmentList(
            $osce_id,
            $jadwal_id,
            $request->only(['search', 'angkatan'])
        );

        return response()->json($result);
    }

    /**
     * Menyimpan perubahan enrollment osce
     */
    public function sync(Request $request, $osce_id, $jadwal_id)
    {
        $validated = $request->validate([
            'id_mahasiswa_array'   => 'present|array',
            'id_mahasiswa_array.*' => 'integer|exists:mahasiswa,id_mahasiswa',
        ]);

        $result = $this->service->syncEnrollment(
            $osce_id,
            $jadwal_id,
            $validated['id_mahasiswa_array']
        );

        return response()->json($result);
    }
}
