<?php

namespace App\Services\Mahasiswa;

use App\Models\EnrollmentOsce;
use App\Services\Mahasiswa\NilaiCalculatorService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class NilaiMahasiswaService
{
    protected $calculator;

    public function __construct(NilaiCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * * @param int $enrollmentId ID EnrollmentOsce
     * @return array Data terstruktur berisi header, daftar_nilai, dan footer.
     * @throws ModelNotFoundException Jika EnrollmentOsce tidak ditemukan.
     */
    public function getCalculatedNilaiDetail(int $enrollmentId): array
    {
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($enrollmentId);

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

        $nilaiByStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
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

        return [
            'header_detail' => $header,
            'daftar_nilai'  => $daftarNilai,
            'footer'        => $footer,
        ];
    }
}
