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
            // ganti ini Redirect ke halaman dashboard kalo mau pr pis
            return redirect()->route('mahasiswa.account.show')->with('error', 'Data mahasiswa tidak ditemukan.');
        }

        $examInfo = $this->jadwalmahasiswaService->getActiveExamInfo($idMahasiswa);
        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', ['message' => 'Tidak ada jadwal ujian aktif saat ini.']);
        }

        $stasePaginator = $this->jadwalmahasiswaService->getJadwalStase($examInfo['id_osce']);

        $mappedStasePaginator = $stasePaginator->through(function ($item) {
            
            $namaPenguji = $item->penguji 
                            ? ($item->penguji->nama_gelar ?? optional($item->penguji->pengguna)->username ?? '-')
                            : '-';

            $namaRuangan = $item->ruang ? $item->ruang->nama_ruang : '-';
            
            return [
                'no' => $item->id,
                'id_osce_stase' => $item->id_osce_stase,
                'stase_keterampilan' => $item->stase->nama_stase ?? 'N/A',
                'waktu' => substr($item->jam_mulai, 0, 5) . ' - ' . substr($item->jam_selesai, 0, 5) . ' WIB',
                'ruangan' => $namaRuangan,
                'penguji' => $namaPenguji,
            ];
        });
        
        // 4. Return Inertia Render
        return Inertia::render('Mahasiswa/JadwalOscePage', [
            'examHeader' => $examInfo,
            'jadwalStase' => $mappedStasePaginator,
        ]);
    }
}