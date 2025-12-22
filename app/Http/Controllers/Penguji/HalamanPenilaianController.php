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
        $data = $this->penilaianService->getAntrianData($id_osce, $id_osce_stase);

        return Inertia::render('Penguji/LiveAntrian', $data);
    }

    public function showPenilaian($id_enrollment_osce)
    {
        $data = $this->penilaianService->getPenilaianData($id_enrollment_osce);

        return Inertia::render('Penguji/LivePenilaian', $data);
    }
}
