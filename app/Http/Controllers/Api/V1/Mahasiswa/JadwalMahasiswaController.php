<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\Mahasiswa\JadwalMahasiswaService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalMahasiswaController extends Controller
{
    protected $jadwalService;

    public function __construct(JadwalMahasiswaService $jadwalService)
    {
        $this->jadwalService = $jadwalService;
    }

    public function getJadwal(Request $request)
    {
        $idMahasiswa = $this->jadwalService->getCurrentMahasiswaId();

        if (!$idMahasiswa) {
            return response()->json(['success' => false, 'message' => 'Mahasiswa not found'], 404);
        }

        // 1. Ambil List Tanggal
        $enrollmentDates = $this->jadwalService->getEnrollmentDates($idMahasiswa);

        // 2. Tentukan Tanggal
        $selectedDate = $request->input('date');

        if (!$selectedDate && $enrollmentDates->isNotEmpty()) {
            $today = Carbon::now()->toDateString();
            $hasToday = $enrollmentDates->contains('date_raw', $today);
            $selectedDate = $hasToday ? $today : $enrollmentDates->first()['date_raw'];
        }

        // Jika data kosong
        if (!$selectedDate) {
            return response()->json([
                'success' => true,
                'data' => [
                    'dates' => [],
                    'header' => null,
                    'schedule' => []
                ]
            ]);
        }

        // 3. Ambil Data Detail
        $examHeader = $this->jadwalService->getExamHeader($idMahasiswa, $selectedDate);
        $jadwalStase = [];

        if ($examHeader) {
            $jadwalStase = $this->jadwalService->getJadwalStaseDetail($examHeader['id_osce'], $selectedDate);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'selected_date' => $selectedDate,
                'available_dates' => $enrollmentDates, // List tanggal untuk dropdown di Frontend
                'exam_info' => $examHeader,
                'schedule_details' => $jadwalStase
            ]
        ]);
    }
}
