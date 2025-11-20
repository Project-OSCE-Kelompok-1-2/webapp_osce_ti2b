<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Services\OsceJadwalService;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Exception;

class OsceJadwalController extends Controller
{
    protected $service;

    public function __construct(OsceJadwalService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /osce/{id_osce}/jadwal
     */
    public function index(Request $request, $id_osce)
    {
        try {
            $data = $this->service->getJadwalList($request, $id_osce);

            return response()->json([
                'status' => 'success',
                'sesi' => $data['sesi'],
                'filters' => $request->only(['search']),
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Data OSCE tidak ditemukan.'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /osce/{id_osce}/jadwal/templates
     * (Untuk keperluan dropdown di form create)
     */
    public function getTemplates($id_osce)
    {
        try {
            $data = $this->service->getTemplates($id_osce);

            return response()->json([
                'status' => 'success',
                'osce' => $data['osce'],
                'templates' => $data['templates'],
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Data OSCE tidak ditemukan.'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /osce/{id_osce}/jadwal
     */
    public function store(Request $request, $id_osce)
    {
        try {
            $this->service->createSession($request, $id_osce);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi berhasil dibuat!',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Validasi gagal.', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan jadwal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * GET /osce/{id_osce}/jadwal/{sesi_id}
     * (Detail untuk Edit)
     */
    public function show($id_osce, $sesi_id)
    {
        try {
            $data = $this->service->getSessionDetail($id_osce, $sesi_id);

            if (!$data) {
                return response()->json(['status' => 'error', 'message' => 'Sesi tidak ditemukan.'], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan.'], 404);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /osce/{id_osce}/jadwal/{sesi_id}
     */
    public function update(Request $request, $id_osce, $sesi_id)
    {
        try {
            $this->service->updateSession($request, $id_osce, $sesi_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi berhasil diperbarui!',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Validasi gagal.', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memperbarui jadwal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /osce/{id_osce}/jadwal/{sesi_id}
     */
    public function destroy($id_osce, $sesi_id)
    {
        try {
            $this->service->deleteSession($id_osce, $sesi_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi berhasil dihapus.',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus jadwal: ' . $e->getMessage()], 500);
        }
    }
}
