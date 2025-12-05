<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentOsce;
use App\Services\NilaiCalculatorService;
use Illuminate\Http\Request;

class NilaiMahasiswaController extends Controller
{
    protected $calculator;

    public function __construct(NilaiCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    public function show($id)
    {
        // 1. EAGER LOADING DALAM (Penguji dihilangkan)
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            // 'osce.osceStase.penguji', <--- DIHAPUS
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($id);
        
        // 2. TRANSFORM DATA HEADER (Penguji dihilangkan)
        $header = [
            'mahasiswa' => [
                'nama'  => $enrollment->mahasiswa->nama ?? '-',
                'nim'   => $enrollment->mahasiswa->nim ?? '-',
                'prodi' => $enrollment->mahasiswa->prodi ?? '-',
            ],
            // Asumsi: 'osce' adalah Mata Kuliah/Ujian yang dinilai
            'mata_kuliah' => [
                'nama' => $enrollment->osce->nama ?? 'OSCE', 
                'kode' => $enrollment->osce->kode ?? '-', 
            ],
            'tahun_akademik' => [
                'semester'  => $enrollment->osce->tahunAkademik->semester ?? '-',
                'tahun'     => $enrollment->osce->tahunAkademik->tahun ?? '-',
            ],
            // 'penguji' dihapus dari header
        ];

        // 3. MEMBANGUN daftar_nilai 
        $daftarNilai = [];
        $nilaiList = $enrollment->nilaiOsce;
        $staseList = $enrollment->osce->osceStase;

        foreach ($staseList as $index => $osceStase) {
            
            // Mencari NilaiOsce yang sesuai dengan Stase saat ini
            // Asumsi: Model NilaiOsce memiliki foreign key 'osce_stase_id'
            $nilaiPerStase = $nilaiList->where('osce_stase_id', $osceStase->id)->first(); 
            
            if (!$nilaiPerStase) {
                continue; 
            }

            // 4. Transformasi Aspek Penilaian (Nested Data Level 2)
            $aspekPenilaian = collect($nilaiPerStase->poinAspekPenilaian)->map(function ($poin) {
                return [
                    'aspek_id' => $poin->aspekPenilaian->id ?? null,
                    'name' => $poin->aspekPenilaian->nama_aspek ?? '-',
                    'weight' => $poin->aspekPenilaian->bobot ?? 0, 
                    'score' => $poin->skor ?? 0,
                ];
            })->toArray();
            
            // 5. PERHITUNGAN NILAI & KETERANGAN (Service Najwa)
            // Mengambil final_score dan predicate (predikat/keterangan)
            $calc = $this->calculator->calculateFinalGrade($nilaiPerStase); 

            // 6. FORMAT JSON SESUAI PERMINTAAN FE (Level 1)
            $daftarNilai[] = [
                'id' => $index + 1,
                'kompetensi' => $osceStase->stase->nama_stase ?? '-',
                'nilai' => $calc['final_score'],        // Nilai Akhir Per Stase dari Najwa
                'keterangan' => $calc['predicate'],     // Predikat dari Najwa (Wajib ada)
                'aspek_penilaian' => $aspekPenilaian,   // Data Nested
            ];
        }

        // 7. FOOTER (Total Nilai)
        // Mengambil overall_score (Rata-rata) dan status (LULUS/TIDAK)
        $footerCalc = $this->calculator->calculateOverallResult($daftarNilai);

        $footer = [
            'total_nilai_akhir' => $footerCalc['overall_score'], // Total Nilai Rata-rata dari Najwa
            'status_kelulusan' => $footerCalc['status'],        // Status Kelulusan (Tebal di FE) dari Najwa
        ];

        // 8. RESPONSE KE FRONTEND
        return inertia('Mahasiswa/NilaiShow', [
            'header_detail' => $header,
            'daftar_nilai' => $daftarNilai,
            'footer' => $footer
        ]);
    }
}