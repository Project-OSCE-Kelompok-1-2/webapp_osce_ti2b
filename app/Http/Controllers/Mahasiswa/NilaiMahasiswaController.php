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
        // 1. EAGER LOADING
        // Load semua relasi yang dibutuhkan untuk perhitungan
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            // PENTING: Load poinAspekPenilaian untuk ambil bobot
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($id);

        // 2. HEADER DATA
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

        // 3. LOGIKA BUILD DATA
        $daftarNilai = [];

        // A. AMBIL SEMUA STASE YANG ADA DI OSCE INI
        $semuaJadwalStase = $enrollment->osce->osceStase ?? collect([]);
        $listStaseUnik = $semuaJadwalStase->unique('id_stase');

        // B. KELOMPOKKAN SEMUA NILAI MAHASISWA BERDASARKAN STASE
        // Caranya: ambil id_stase dari chain relasi
        $nilaiByStase = collect($enrollment->nilaiOsce)->groupBy(function ($nilai) {
            // Chain: nilaiOsce -> poinAspekPenilaian -> aspekPenilaian -> id_stase
            return $nilai->poinAspekPenilaian?->aspekPenilaian?->id_stase ?? 'undefined';
        });

        // C. LOOPING SETIAP STASE
        foreach ($listStaseUnik as $osceStase) {
            $staseData = $osceStase->stase;
            $staseId   = $staseData->id_stase ?? null;

            if (!$staseId) continue;

            $namaStase = $staseData->nama_stase ?? 'Stase Tanpa Nama';

            // D. AMBIL SEMUA NILAI UNTUK STASE INI
            $kumpulanNilai = $nilaiByStase->get($staseId);

            $nilaiAkhir = 0;
            $predikat   = 'BELUM DINILAI';

            // E. HITUNG NILAI JIKA ADA DATA
            if ($kumpulanNilai && $kumpulanNilai->isNotEmpty()) {

                // Kirim collection NilaiOsce ke calculator
                // Calculator akan mengambil:
                // - skor dari nilai_osce.nilai (0-4)
                // - bobot dari poin_aspek_penilaian.bobot
                // - lalu hitung: Σ(skor × bobot) / 4
                $calc = $this->calculator->calculateFinalGrade($kumpulanNilai);

                $nilaiAkhir = $calc['final_score'];
                $predikat   = $calc['predicate'];
            }

            // F. MASUKKAN KE ARRAY HASIL
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

        // 5. RETURN KE VIEW
        return Inertia::render('Mahasiswa/NilaiShow', [
            'header_detail' => $header,
            'daftar_nilai'  => $daftarNilai,
            'footer'        => $footer,
        ]);
    }
}
