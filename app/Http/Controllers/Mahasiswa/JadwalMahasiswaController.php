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

        // 1. Ambil Semua Tanggal Ujian Mahasiswa
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

        // Update state 'is_selected' untuk UI dropdown
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

        // 3. Ambil Info Header
        $examInfo = $this->jadwalService->getActiveExamInfo($idMahasiswa, $selectedDate);

        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', [
                'enrollmentDates' => $enrollmentDates,
                'examHeader'      => null,
                'jadwalStase'     => []
            ]);
        }

        // 4. Ambil Data Jadwal Stase
        // [PERBAIKAN] Tambahkan parameter ke-3 yaitu ID SESI dari $examInfo
        $staseCollection = $this->jadwalService->getJadwalStase(
            $examInfo['id_osce'], 
            $selectedDate, 
            $examInfo['jam_sesi_raw'] // Ini berisi '08:00:00' atau sejenisnya
        );

        $mappedStase = $staseCollection->map(function ($item) {
            // ... (mapping logic sama seperti sebelumnya) ...
             $namaPenguji = '-';
            if ($item->penguji) {
                $namaPenguji = $item->penguji->nama ?? 'Penguji';
            }

            $namaRuangan = '-';
            if ($item->ruang) {
                $nomor = $item->ruang->nomor_ruangan;
                $lokasi = $item->ruang->lokasi;
                if (!empty($lokasi)) {
                    $namaRuangan = "$nomor - $lokasi";
                } else {
                    $namaRuangan = $nomor;
                }
            }

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