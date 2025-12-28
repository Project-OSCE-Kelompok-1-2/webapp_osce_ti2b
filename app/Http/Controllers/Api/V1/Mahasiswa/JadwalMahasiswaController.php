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

        $enrollmentDates = $this->jadwalService->getEnrollmentDates($idMahasiswa);

        $selectedDate = $request->input('date');

        if (!$selectedDate && $enrollmentDates->isNotEmpty()) {
            $today = Carbon::now()->toDateString();
            $hasToday = $enrollmentDates->contains('date_raw', $today);
            $selectedDate = $hasToday ? $today : $enrollmentDates->first()['date_raw'];
        }

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

        $examHeader = $this->jadwalService->getExamHeader($idMahasiswa, $selectedDate);
        $jadwalStase = [];

        if ($examHeader) {
            $jadwalStase = $this->jadwalService->getJadwalStaseDetail($examHeader['id_osce'], $selectedDate);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'selected_date' => $selectedDate,
                'available_dates' => $enrollmentDates, 
                'exam_info' => $examHeader,
                'schedule_details' => $jadwalStase
            ]
        ]);
    }
}
