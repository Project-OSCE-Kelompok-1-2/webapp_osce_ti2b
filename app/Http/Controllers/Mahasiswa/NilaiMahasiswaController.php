<?php

namespace App\Http\Controllers\Mahasiswa;

use Inertia\Inertia;
use Inertia\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use App\Services\Mahasiswa\NilaiCalculatorService;

class NilaiMahasiswaController extends Controller
{
    protected $calculator;

    public function __construct(NilaiCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    public function show($id)
    {
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($id);

        $header = [
            'mahasiswa' => [
                'nama'  => $enrollment->mahasiswa->nama ?? '-',
                'nim'   => $enrollment->mahasiswa->nim ?? '-',
                'prodi' => $enrollment->mahasiswa->prodi ?? '-',
            ],
            'mata_kuliah' => [
                'nama' => $enrollment->osce->nama_osce ?? 'OSCE',
            ],
            'tahun_akademik' => [
                'semester'  => $enrollment->osce->tahunAkademik->semester ?? '-',
                'tahun'     => $enrollment->osce->tahunAkademik->tahun ?? '-',
            ],
        ];

        $daftarNilai = [];

        $semuaJadwalStase = $enrollment->osce->osceStase ?? collect([]);
        $listStaseUnik = $semuaJadwalStase->unique('id_stase');

        $nilaiByStase = collect($enrollment->nilaiOsce)->groupBy(function ($nilai) {
            return $nilai->poinAspekPenilaian?->aspekPenilaian?->id_stase ?? 'undefined';
        });

        foreach ($listStaseUnik as $osceStase) {
            $staseData = $osceStase->stase;
            $staseId   = $staseData->id_stase ?? null;

            if (!$staseId) continue;

            $namaStase = $staseData->nama_stase ?? 'Stase Tanpa Nama';

            $kumpulanNilai = $nilaiByStase->get($staseId);

            $nilaiAkhir = 0;
            $predikat   = 'BELUM DINILAI';

            if ($kumpulanNilai && $kumpulanNilai->isNotEmpty()) {

                $calc = $this->calculator->calculateFinalGrade($kumpulanNilai);

                $nilaiAkhir = $calc['final_score'];
                $predikat   = $calc['predicate'];
            }

            $daftarNilai[] = [
                'id'         => $staseId,
                'nama_stase' => $namaStase,
                'nilai'      => $nilaiAkhir,
                'keterangan' => $predikat,
            ];
        }

        $daftarNilai = array_values($daftarNilai);

        $footerCalc = $this->calculator->calculateOverallResult($daftarNilai);

        $footer = [
            'total_nilai_akhir' => $footerCalc['overall_score'] ?? 0,
            'status_kelulusan'  => $footerCalc['status'] ?? 'BELUM LENGKAP',
        ];

        return Inertia::render('Mahasiswa/NilaiShow', [
            'header_detail' => $header,
            'daftar_nilai'  => $daftarNilai,
            'footer'        => $footer,
        ]);
    }
}
