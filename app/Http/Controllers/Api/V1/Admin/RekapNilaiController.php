<?php

namespace App\Http\Controllers\Api\V1\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\RekapNilaiService;
use Illuminate\Database\Eloquent\ModelNotFoundException; // Tambahkan import ini

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
        // Method ini aman karena biasanya hanya query list (paginate), 
        // kalau kosong dia return array kosong, bukan error 404.
        $search = $request->query("search");
        $tahun = $request->query("tahun");
        $osces = $this->service->getRekapList($request, $search, $tahun);

        return response()->json([
            'status' => 'success',
            'osce' => $osces,
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }

    /**
     * List Sesi per OSCE
     */
    public function listSesi(Request $request, $id_osce)
    {
        try {
            $search = $request->input('search');
            $data = $this->service->getSesiList( $id_osce, $search);

            return response()->json([
                'status' => 'success',
                'message' => 'Daftar sesi berhasil diambil.',
                'data' => $data['sesi'],
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => 'false',
                'message' => 'Data OSCE tidak ditemukan.'
            ], 404);
        }
    }

    /**
     * List Mahasiswa per Sesi
     */
    public function listMahasiswaPerStase(Request $request, $id_osce, $id_sesi)
    {
        try {
            $search = $request->query(key: 'search');
            $angkatan = $request->query('angkatan');
            $data = $this->service->getMahasiswaPerSesi($id_osce, $id_sesi, $search, $angkatan);

            return response()->json([
                'status' => 'success',
                'osce' => $data['osce'],
                'sesi' => $data['sesi_info'],
                'mahasiswa_list' => $data['mahasiswa_list'],
                'filters' => $request->only(['search', 'angkatan']),
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data OSCE atau Sesi tidak ditemukan.'
            ], 404);
        }
    }

    /**
     * Detail Nilai Mahasiswa
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        try {
            // Service mungkin melempar error jika lookup user/osce gagal di awal
            $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

            // Handle case jika service mereturn null (logic manual di service)
            if (!$detailNilai) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Data mahasiswa untuk OSCE ini tidak ditemukan (Enrollment tidak ada).'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'detailNilai' => $detailNilai
            ]);
        } catch (ModelNotFoundException $e) {
            // Handle case jika ID Mahasiswa atau ID OSCE di URL ngawur
            return response()->json([
                'status' => 'error',
                'message' => 'Data Mahasiswa atau OSCE tidak valid/ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server.'
            ], 500);
        }
    }
}
