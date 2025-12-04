<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\JadwalMahasiswaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JadwalMahasiswaController extends Controller
{
    protected $jadwalmahasiswaService;

    public function __construct(JadwalMahasiswaService $jadwalmahasiswaService)
    {
        $this->jadwalmahasiswaService = $jadwalmahasiswaService;
    }

    /**
     * Menampilkan data Jadwal OSCE untuk Mahasiswa yang sedang login.
     * GET /mahasiswa/jadwal-mahasiswa
     * * @return JsonResponse
     *
     * @response 200 array{...} 
     * // Scramble akan mendokumentasikan skema output JSON di sini
     */
    public function show_jadwal() // <-- Nama method sudah disesuaikan
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