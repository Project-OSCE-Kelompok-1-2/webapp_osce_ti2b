<?php

namespace App\Http\Controllers\Api\V1\Penguji;

use App\Http\Controllers\Controller;
use App\Services\Penguji\RekapService;

class RekapApiController extends Controller
{
    protected $rekapService;

    public function __construct(RekapService $rekapService)
    {
        $this->rekapService = $rekapService;
    }

    public function getRekap($id_osce, $id_osce_stase)
    {
        $data = $this->rekapService->getRekapData($id_osce, $id_osce_stase);

        $mahasiswaList = $data['mahasiswa']->map(fn($item) => [
            'id_enrollment_osce' => $item->id_enrollment_osce,
            'nama' => $item->mahasiswa->nama ?? '-',
            'nim' => $item->mahasiswa->nim ?? '-',
            'nilai_total' => $item->nilai_total ? round((float)$item->nilai_total, 2) : 0,
        ]);

        return response()->json([
            'status' => true,
            'penguji' => $data['penguji']->nama,
            'osce' => [
                'nama_osce' => $data['osce']->osce->nama_osce,
                'nama_stase' => $data['osce']->stase->nama_stase,
            ],
            'mahasiswa' => $mahasiswaList
        ]);
    }
}
