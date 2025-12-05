<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\JadwalMahasiswaService;
use Inertia\Inertia; //
use Illuminate\Http\Request;

class JadwalMahasiswaController extends Controller
{
    protected $jadwalmahasiswaService;

    public function __construct(JadwalMahasiswaService $jadwalmahasiswaService)
    {
        $this->jadwalmahasiswaService = $jadwalmahasiswaService;
    }

    public function show_jadwal()
    {
        $idMahasiswa = $this->jadwalmahasiswaService->getCurrentMahasiswaId();
        
        if (!$idMahasiswa) {
            return redirect()->route('dashboard')->with('error', 'Akses khusus mahasiswa.');
        }

        $examInfo = $this->jadwalmahasiswaService->getActiveExamInfo($idMahasiswa);
        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', ['message' => 'Tidak ada jadwal ujian aktif saat ini.']);
        }

        $stasePaginator = $this->jadwalmahasiswaService->getJadwalStase($examInfo['id_osce']);

        // 🛑 PERBAIKAN KRITIS: TRANSFORMASI DATA DENGAN ->through()
        // Kita petakan setiap item di dalam paginator ke format string yang aman.
        $mappedStasePaginator = $stasePaginator->through(function ($item) {
            
            // 1. Ekstrak string nama penguji
            $namaPenguji = $item->penguji 
                            ? ($item->penguji->nama_gelar ?? optional($item->penguji->pengguna)->username ?? '-')
                            : '-';

            // 2. Ekstrak string nama ruangan
            $namaRuangan = $item->ruang ? $item->ruang->nama_ruang : '-';
            
            // 3. Mengembalikan array data yang sudah di-'string'-kan
            return [
                'no' => $item->id, // atau gunakan counter pagination jika diperlukan
                'id_osce_stase' => $item->id_osce_stase,
                'stase_keterampilan' => $item->stase->nama_stase ?? 'N/A',
                'waktu' => substr($item->jam_mulai, 0, 5) . ' - ' . substr($item->jam_selesai, 0, 5) . ' WIB',
                'ruangan' => $namaRuangan, // Sekarang STRING
                'penguji' => $namaPenguji, // Sekarang STRING
            ];
        });
        
        // 4. Return Inertia Render
        return Inertia::render('Mahasiswa/JadwalOscePage', [
            'examHeader' => $examInfo,
            'jadwalStase' => $mappedStasePaginator, // Kirim Paginator yang sudah di-map
        ]);
    }
}