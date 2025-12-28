<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\Request;
use App\Services\Admin\OsceJadwalService;
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
     * Menampilkan data sesi jadwal per hari (Grouped)
     */
    public function index(Request $request, $id_osce)
    {
        try {
            $search = $request->query('search');
            $data = $this->service->getJadwalList($id_osce, $search);

            return response()->json([
                'status' => 'success',
                'data' => $data['sesi'], // Paginated result
                'filters' => $request->only(['search']),
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Data OSCE tidak ditemukan.'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mengambil template stase (stase tanpa tanggal) untuk form create/edit
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
            return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan.'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Membuat sesi jadwal ujian baru
     */
    public function store(Request $request, $id_osce)
    {
        try {
            $validated = $request->validate([
                'tanggal'       => 'required|date',
                'jam_mulai'     => 'required|date_format:H:i',
                'durasi'        => 'required|numeric', 
                'stase_ids'     => 'required|array|min:1',
                'stase_ids.*'   => 'exists:osce_stase,id_osce_stase',
                'mahasiswa_ids' => 'nullable|array',
                'mahasiswa_ids.*' => 'exists:mahasiswa,id_mahasiswa'
            ]);

            $newSession = $this->service->createSession($validated, $id_osce);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi berhasil dibuat!',
                'data' => $newSession
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Validasi gagal.', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id_osce, $sesi_id)
    {
        try {
            $data = $this->service->getSessionDetail($id_osce, $sesi_id);

            if (!$data || $data['stase_data']->isEmpty()) {
                return response()->json(['status' => 'error', 'message' => 'Sesi tidak ditemukan.'], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update sesi jadwal ujian
     */
    public function update(Request $request, $id_osce, $sesi_id)
    {
        try {
            $validated = $request->validate([
                'tanggal'     => 'required|date',
                'jam_mulai'   => 'required|date_format:H:i',
                'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
                'stase_ids'   => 'required|array|min:1',
                'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
            ]);

            $updatedSession = $this->service->updateSession($validated, $id_osce, $sesi_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi berhasil diperbarui!',
                'data' => $updatedSession
            ]);
        } catch (ValidationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Validasi gagal.', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal update: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus sesi jadwal ujian
     */
    public function destroy($id_osce, $sesi_id)
    {
        try {
            $this->service->deleteSession($id_osce, $sesi_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal sesi dan enrollment berhasil dihapus.',
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal hapus: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cek ketersediaan Ruangan & Penguji
     */
    public function checkAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'tanggal' => 'required|date',
                'jam_mulai' => 'required',
                'durasi' => 'required|numeric',
            ]);

            $result = $this->service->checkAvailability($validated);

            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Ambil data mahasiswa untuk dropdown enrollment
     */
    public function getMahasiswa(Request $request)
    {
        try {
            $id_osce = $request->id_osce;
            $angkatan = $request->angkatan;

            $data = $this->service->getMahasiswaCandidates($id_osce, $angkatan);

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
