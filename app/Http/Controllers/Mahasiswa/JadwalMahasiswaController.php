<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Services\JadwalMahasiswaService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class JadwalMahasiswaController extends Controller
{
    protected $jadwalService;

    public function __construct(JadwalMahasiswaService $jadwalService)
    {
        $this->jadwalService = $jadwalService;
    }

    public function show_jadwal()
    {
        $idMahasiswa = $this->jadwalService->getCurrentMahasiswaId();
        
        if (!$idMahasiswa) {
            return redirect()->route('mahasiswa.dashboard')
                ->with('error', 'Data profil mahasiswa tidak ditemukan.');
        }

        $examInfo = $this->jadwalService->getActiveExamInfo($idMahasiswa);
        
        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', [
                'examHeader'  => null,
                'jadwalStase' => [] 
            ]);
        }

        // Ambil Data sebagai Collection
        $staseCollection = $this->jadwalService->getJadwalStase($examInfo['id_osce']);

        // [UBAH] Gunakan map() biasa, bukan through()
        $mappedStase = $staseCollection->map(function ($item, $index) {
            
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
            'examHeader'  => $examInfo,
            'jadwalStase' => $mappedStase, // Kirim Array Full
        ]);
    }
}