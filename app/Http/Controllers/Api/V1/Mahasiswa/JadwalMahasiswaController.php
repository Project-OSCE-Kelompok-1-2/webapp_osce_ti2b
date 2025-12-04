<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\JadwalMahasiswaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Tambahkan ini

class JadwalMahasiswaController extends Controller
{
    protected $jadwalmahasiswaService;

    public function __construct(JadwalMahasiswaService $jadwalmahasiswaService)
    {
        $this->jadwalmahasiswaService = $jadwalmahasiswaService;
    }

    /**
     * Menampilkan data Jadwal OSCE Mahasiswa
     * GET /api/v1/mahasiswa/jadwal-osce
     * * @return JsonResponse // Tipe hint yang eksplisit
     *
     * @response 200 array{
     * success: bool,
     * data: array{
     * exam_header: array{id_osce: int, judul: string, tanggal_formatted: string, waktu_mulai: string, waktu_selesai: string, countdown_target: string},
     * schedule_table: array{
     * items: array<int, array{no: int, stase_keterampilan: string, waktu: string, ruangan: string, penguji: string}>, 
     * pagination: array{current_page: int, total_pages: int, total_items: int}
     * }
     * }
     * }
     * @response 403 array{success: bool, message: string}
     * @response 404 array{success: bool, message: string}
     */
    public function index()
    {
        try {
            $idMahasiswa = $this->jadwalmahasiswaService->getCurrentMahasiswaId();

            if (!$idMahasiswa) {
                return response()->json(['success' => false, 'message' => 'Akses ditolak. Data mahasiswa tidak ditemukan.'], 403);
            }

            $examInfo = $this->jadwalmahasiswaService->getActiveExamInfo($idMahasiswa);

            if (!$examInfo) {
                return response()->json(['success' => false, 'message' => 'Tidak ada jadwal ujian OSCE yang aktif saat ini.'], 404);
            }

            $stasePaginator = $this->jadwalmahasiswaService->getJadwalStase($examInfo['id_osce']);

            $formattedStase = $stasePaginator->getCollection()->map(function ($item, $key) use ($stasePaginator) {
                
                $namaPenguji = '-';
                if ($item->penguji) {
                    $namaPenguji = $item->penguji->nama_gelar ?? optional($item->penguji->pengguna)->username ?? 'Penguji';
                }

                return [
                    'no' => $stasePaginator->firstItem() + $key,
                    'id_osce_stase' => $item->id_osce_stase,
                    'stase_keterampilan' => $item->stase->nama_stase ?? 'Stase',
                    'waktu' => substr($item->jam_mulai, 0, 5) . ' - ' . substr($item->jam_selesai, 0, 5) . ' WIB',
                    'ruangan' => $item->ruang->nama_ruang ?? '-',
                    'penguji' => $namaPenguji,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'exam_header' => $examInfo,
                    'schedule_table' => [
                        'items' => $formattedStase,
                        'pagination' => [
                            'current_page' => $stasePaginator->currentPage(),
                            'total_pages' => $stasePaginator->lastPage(),
                            'total_items' => $stasePaginator->total(),
                        ]
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan internal server.', 'error' => $e->getMessage()], 500);
        }
    }
}