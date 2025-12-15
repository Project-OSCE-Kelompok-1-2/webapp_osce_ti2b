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
     * Mengambil detail enrollment, menghitung nilai per stase, dan mengembalikan data terstruktur.
     * * @param int $enrollmentId ID EnrollmentOsce
     * @return array Data terstruktur berisi header, daftar_nilai, dan footer.
     * @throws ModelNotFoundException Jika EnrollmentOsce tidak ditemukan.
     */
    public function getCalculatedNilaiDetail(int $enrollmentId): array
    {
        // 1. EAGER LOADING (Dipindahkan dari Controller)
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($enrollmentId);

        // 2. HEADER DATA (Dipindahkan dari Controller)
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

        // 3. LOGIKA BUILD DAFTAR NILAI (Dipindahkan dari Controller)
        $daftarNilai = [];

        // A. AMBIL SEMUA STASE YANG ADA DI OSCE INI
        $semuaJadwalStase = $enrollment->osce->osceStase ?? collect([]);
        // Hanya ambil stase unik (karena satu stase bisa punya banyak jadwal/osceStase)
        $listStaseUnik = $semuaJadwalStase->unique('id_stase');

        // B. KELOMPOKKAN SEMUA NILAI MAHASISWA BERDASARKAN STASE
        $nilaiByStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
            // Chain: nilaiOsce -> poinAspekPenilaian -> aspekPenilaian -> id_stase
            return $nilai->poinAspekPenilaian?->aspekPenilaian?->id_stase ?? 'undefined';
        });

        // C. LOOPING SETIAP STASE DAN HITUNG NILAI
        foreach ($listStaseUnik as $osceStase) {
            $staseData = $osceStase->stase;
            $staseId   = $staseData->id_stase ?? null;

            if (!$staseId) continue;

            $namaStase = $staseData->nama_stase ?? 'Stase Tanpa Nama';
            $kumpulanNilai = $nilaiByStase->get($staseId);

            $nilaiAkhir = 0;
            $predikat   = 'BELUM DINILAI';

            if ($kumpulanNilai && $kumpulanNilai->isNotEmpty()) {
                // Panggil Service Calculator
                $calc = $this->calculator->calculateFinalGrade($kumpulanNilai);
                $nilaiAkhir = $calc['final_score'];
                $predikat   = $calc['predicate'];
            }

            // D. MASUKKAN KE ARRAY HASIL
            $daftarNilai[] = [
                'id'         => $staseId,
                'nama_stase' => $namaStase,
                'nilai'      => $nilaiAkhir,
                'keterangan' => $predikat,
            ];
        }

        // Reset index array
        $daftarNilai = array_values($daftarNilai);

        // 4. FOOTER - Hitung rata-rata keseluruhan
        $footerCalc = $this->calculator->calculateOverallResult($daftarNilai);

        $footer = [
            'total_nilai_akhir' => $footerCalc['overall_score'] ?? 0,
            'status_kelulusan'  => $footerCalc['status'] ?? 'BELUM LENGKAP',
        ];

        // 5. Kembalikan semua data terstruktur
        return [
            'header_detail' => $header,
            'daftar_nilai'  => $daftarNilai,
            'footer'        => $footer,
        ];
    }
}
