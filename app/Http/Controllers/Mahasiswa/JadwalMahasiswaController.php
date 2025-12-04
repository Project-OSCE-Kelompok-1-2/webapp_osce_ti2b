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

    public function index()
    {
        $idMahasiswa = $this->jadwalmahasiswaService->getCurrentMahasiswaId();
        
        // 1. Handle jika bukan mahasiswa / user tidak valid
        if (!$idMahasiswa) {
            return redirect()->route('dashboard')->with('error', 'Akses khusus mahasiswa.');
        }

        $examInfo = $this->jadwalmahasiswaService->getActiveExamInfo($idMahasiswa);

        // 2. Handle jika tidak ada ujian (bisa redirect atau render page kosong)
        if (!$examInfo) {
            return Inertia::render('Mahasiswa/JadwalOsce/EmptyState', [
                'message' => 'Tidak ada jadwal ujian aktif saat ini.'
            ]);
        }

        // 3. Ambil data tabel
        $stasePaginator = $this->jadwalmahasiswaService->getJadwalStase($examInfo['id_osce']);

        // 4. Return Inertia Render
        // Pastikan Anda punya file Page di: resources/js/Pages/Mahasiswa/JadwalOsce/Index.vue (atau .jsx)
        return Inertia::render('Mahasiswa/JadwalOsce/Index', [
            'examHeader' => $examInfo, // Object Header
            'jadwalStase' => $stasePaginator, // Inertia otomatis menghandle object Pagination Laravel
        ]);
    }
}