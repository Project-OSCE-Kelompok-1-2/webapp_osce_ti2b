<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\Penguji\HalamanPenilaianService;

class HalamanPenilaianController extends Controller
{
    protected $penilaianService;

    /**
     * Inject HalamanPenilaianService melalui constructor.
     */
    public function __construct(HalamanPenilaianService $penilaianService)
    {
        $this->penilaianService = $penilaianService;
    }

    public function showAntrian($id_osce, $id_osce_stase)
    {
        // 1. Panggil logic dari service
        // Service mengembalikan array ['osce_detail' => ..., 'antrian_mahasiswa' => ...]
        $data = $this->penilaianService->getAntrianData($id_osce, $id_osce_stase);

        // 2. Return ke Inertia (Struktur props tetap sama persis)
        return Inertia::render('Penguji/LiveAntrian', $data);
    }

    public function showPenilaian($id_enrollment_osce)
    {
        // 1. Panggil logic dari service
        // Service mengembalikan array lengkap (mahasiswa, info_ujian, rubrik, sisa_waktu, dll)
        $data = $this->penilaianService->getPenilaianData($id_enrollment_osce);

        // 2. Return ke Inertia (Struktur props tetap sama persis)
        return Inertia::render('Penguji/LivePenilaian', $data);
    }
}
