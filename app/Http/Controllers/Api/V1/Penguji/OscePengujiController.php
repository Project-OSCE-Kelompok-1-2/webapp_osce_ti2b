<?php

namespace App\Http\Controllers\Api\Penguji;

use App\Http\Controllers\Controller;
use App\Services\OscePengujiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OsceController extends Controller
{
    protected $oscePengujiService;

    public function __construct(OscePengujiService $oscePengujiService)
    {
        $this->oscePengujiService = $oscePengujiService;
    }

    /**
     * Daftar Jadwal OSCE Penguji
     * * Mengambil daftar stase/jadwal OSCE yang ditugaskan kepada penguji yang sedang login.
     * Mendukung pagination, pencarian nama OSCE, dan filter tahun akademik.
     * * @group Penguji
     * @authenticated
     * * @queryParam search string Filter berdasarkan nama OSCE. Example: Komprehensif
     * @queryParam tahun string Filter berdasarkan tahun akademik. Example: 2024
     * @queryParam page int Nomor halaman pagination. Example: 1
     * * @response array{
     * osce_list: object,
     * filters: array{
     * search: string|null,
     * tahun: string|null
     * }
     * }
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tahun  = $request->input('tahun');
        $user   = Auth::user();

        // Panggil Service
        $osceList = $this->osceService->getAssignmentsForPenguji($user, $search, $tahun);

        // Return JSON dengan struktur yang sama persis dengan Inertia props
        return response()->json([
            'osce_list' => $osceList, // Ini berisi objek Paginator (data, links, meta)
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}