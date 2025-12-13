<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\JadwalMahasiswaService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalMahasiswaController extends Controller
{
    protected $jadwalService;

    public function __construct(JadwalMahasiswaService $jadwalService)
    {
        $this->jadwalService = $jadwalService;
    }

    public function show_jadwal(Request $request)
    {
        $idMahasiswa = $this->jadwalService->getCurrentMahasiswaId();

        if (!$idMahasiswa) {
            return redirect()->route('mahasiswa.dashboard')
                ->with('error', 'Data profil mahasiswa tidak ditemukan.');
        }

        // 1. Ambil Tanggal Enrollment
        $enrollmentDates = $this->jadwalService->getEnrollmentDates($idMahasiswa);

        // 2. Tentukan Tanggal Terpilih
        $selectedDate = $request->input('date');

        if (!$selectedDate && $enrollmentDates->isNotEmpty()) {
            $today = Carbon::now()->toDateString();
            $defaultDate = $enrollmentDates->firstWhere('date_raw', $today);

            if ($defaultDate) {
                $selectedDate = $defaultDate['date_raw'];
            } else {
                $selectedDate = $enrollmentDates->sortBy('date_raw')->first()['date_raw'] ?? null;
            }
        }

        // Tandai tanggal yang aktif di dropdown
        $enrollmentDates = $enrollmentDates->map(function ($item) use ($selectedDate) {
            $item['is_selected'] = $item['date_raw'] === $selectedDate;
            return $item;
        })->values();

        if (!$selectedDate) {
            return Inertia::render('Mahasiswa/JadwalOscePage', [
                'enrollmentDates' => $enrollmentDates,
                'examHeader'      => null,
                'jadwalStase'     => []
            ]);
        }

        // 3. Ambil Info Header & Countdown
        $examInfo = $this->jadwalService->getActiveExamInfo($idMahasiswa, $selectedDate);

        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', [
                'enrollmentDates' => $enrollmentDates,
                'examHeader'      => null,
                'jadwalStase'     => []
            ]);
        }

        // 4. Ambil Data Jadwal Stase
        $staseCollection = $this->jadwalService->getJadwalStase($examInfo['id_osce'], $selectedDate);

        $mappedStase = $staseCollection->map(function ($item) {
            $namaPenguji = '-';
            if ($item->penguji) {
                $namaPenguji = $item->penguji->nama_gelar
                    ?? optional($item->penguji->pengguna)->username
                    ?? 'Penguji';
            }

            $namaRuangan = $item->ruang ? $item->ruang->nomor_ruangan : '-';
            $jamMulai = substr($item->jam_mulai, 0, 5);
            $jamSelesai = substr($item->jam_selesai, 0, 5);

            return [
                'id_osce_stase'      => $item->id_osce_stase,
                'stase_keterampilan' => $item->stase->nama_stase ?? 'Stase Tanpa Nama',
                'waktu'              => "$jamMulai - $jamSelesai WIB",
                'jam_mulai_raw'      => $jamMulai,
                'ruangan'            => $namaRuangan,
                'penguji'            => $namaPenguji,
            ];
        });

        return Inertia::render('Mahasiswa/JadwalOscePage', [
            'enrollmentDates' => $enrollmentDates,
            'examHeader'      => $examInfo,
            'jadwalStase'     => $mappedStase,
        ]);
    }
}
