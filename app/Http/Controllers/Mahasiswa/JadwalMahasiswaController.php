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
        // 1. Ambil ID Mahasiswa Login
        $idMahasiswa = $this->jadwalService->getCurrentMahasiswaId();
        
        if (!$idMahasiswa) {
            return redirect()->route('mahasiswa.dashboard')
                ->with('error', 'Data profil mahasiswa tidak ditemukan.');
        }

        // 2. Ambil Data Header (Info Ujian)
        $examInfo = $this->jadwalService->getActiveExamInfo($idMahasiswa);
        
        // Jika tidak ada ujian, kirim null agar React menangani tampilan kosong (opsional)
        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOscePage', [
                'examHeader'  => null,
                'jadwalStase' => ['data' => [], 'links' => []]
            ]);
        }

        // 3. Ambil Data Tabel (Stase) & Mapping Format
        $stasePaginator = $this->jadwalService->getJadwalStase($examInfo['id_osce']);

        // Transformasi data agar sesuai kolom tabel React
        $mappedStasePaginator = $stasePaginator->through(function ($item, $index) use ($stasePaginator) {
            
            // Logika Nama Penguji: Coba Nama Gelar -> Username -> '-'
            $namaPenguji = '-';
            if ($item->penguji) {
                $namaPenguji = $item->penguji->nama_gelar 
                    ?? optional($item->penguji->pengguna)->username 
                    ?? 'Penguji';
            }

            $namaRuangan = $item->ruang ? $item->ruang->nomor_ruangan : '-';
            
            // Format Jam: 08:00:00 -> 08:00
            $jamMulai = substr($item->jam_mulai, 0, 5);
            $jamSelesai = substr($item->jam_selesai, 0, 5);

            // Perhitungan Nomor Urut (agar continue saat ganti halaman)
            $nomorUrut = ($stasePaginator->currentPage() - 1) * $stasePaginator->perPage() + $index + 1;

            return [
                'no'                 => $nomorUrut,
                'id_osce_stase'      => $item->id_osce_stase,
                'stase_keterampilan' => $item->stase->nama_stase ?? 'Stase Tanpa Nama',
                'waktu'              => "$jamMulai - $jamSelesai WIB",
                'ruangan'            => $namaRuangan,
                'penguji'            => $namaPenguji,
            ];
        });
        
        // 4. Render ke Page React
        // Pastikan file React Anda bernama 'JadwalOscePage.jsx' di folder 'resources/js/Pages/Mahasiswa/'
        return Inertia::render('Mahasiswa/JadwalOscePage', [
            'examHeader'  => $examInfo,
            'jadwalStase' => $mappedStasePaginator,
        ]);
    }
}