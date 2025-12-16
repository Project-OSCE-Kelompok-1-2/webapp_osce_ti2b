<?php

namespace App\Http\Controllers\Api\V1\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Services\Mahasiswa\NilaiCalculatorService;
use App\Services\Mahasiswa\NilaiMahasiswaService;
use Illuminate\Support\Facades\Auth;
use Exception;

class ListNilaiMahasiswaController extends Controller
{
    protected $calculator;
    protected $nilaiService;

    public function __construct(NilaiCalculatorService $calculator, NilaiMahasiswaService $nilaiService)
    {
        $this->calculator = $calculator;
        $this->nilaiService = $nilaiService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswa()->first();

        // Ambil Opsi Filter (Tetap di Controller karena ini data statis UI)
        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        if (!$mahasiswa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data mahasiswa tidak ditemukan.'
            ], 404);
        }

        try {
            // 1. Ambil data enrollment mentah dari Service
            $ujianRaw = $this->nilaiService->getMahasiswaEnrollments($mahasiswa->id_mahasiswa, $request->all());

            // 2. TRANSFORMASI & HITUNG NILAI
            $tahunMasuk = $mahasiswa->tahun_masuk ?? (date('Y') - 2);

            $ujianData = $ujianRaw->map(function ($enrollment) use ($mahasiswa, $tahunMasuk) {

                $osce = $enrollment->osce;
                $tahunAkademik = $osce->tahunAkademik;
                $tahunAkademikStr = $tahunAkademik->tahun ?? '-';
                $semesterLabel = $tahunAkademik->semester ?? '-';

                // A. Kelompokkan Nilai per Stase
                $semuaJadwalStase = $enrollment->osce->osceStase ?? collect([]);
                $listStaseUnik = $semuaJadwalStase->unique('id_stase');
                $nilaiByStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
                    return $nilai->poinAspekPenilaian->aspekPenilaian->id_stase ?? 'undefined';
                });

                $daftarNilaiStase = [];

                // B. Hitung Nilai Per Stase
                foreach ($listStaseUnik as $osceStase) {
                    $staseId = $osceStase->id_stase;
                    if (!$staseId) continue;

                    $kumpulanNilai = $nilaiByStase->get($staseId);
                    $calc = $this->calculator->calculateFinalGrade($kumpulanNilai ?? collect([]));

                    $daftarNilaiStase[] = [
                        'id' => $staseId,
                        'nama_stase' => $osceStase->stase->nama_stase ?? 'Stase Tidak Ditemukan',
                        'nilai' => $calc['final_score'],
                        'keterangan' => $calc['predicate']
                    ];
                }

                // C. Hitung Rata-rata & Status Akhir
                $overallResult = $this->calculator->calculateOverallResult($daftarNilaiStase);

                // D. Hitung Semester Angka
                $semesterAngka = $this->calculator->getSemesterAngka($tahunAkademikStr, $tahunMasuk);

                return [
                    'id'               => $enrollment->id_enrollment_osce,
                    'id_osce'          => $osce->id_osce,
                    'nama_ujian'       => $osce->nama_osce,
                    'tanggal_ujian'    => $osce->tanggal_mulai,
                    'semester_angka'   => (string) $semesterAngka,
                    'semester_label'   => $semesterLabel,
                    'tahun_ujian'      => $tahunAkademikStr,
                    'nilai_total'      => number_format((float) ($overallResult['overall_score'] ?? 0), 2),
                    'status_kelulusan' => $overallResult['status'] ?? 'BELUM LENGKAP',
                    'detail_nilai_stase' => $daftarNilaiStase, // Sertakan detail nilai per stase
                    'dosen_penguji'    => '-',
                ];
            });

            // 3. Kirim JSON Response
            return response()->json([
                'status' => 'success',
                'mahasiswa' => [
                    'nama'   => $mahasiswa->nama,
                    'nim'    => $mahasiswa->nim,
                    'prodi'  => $mahasiswa->prodi ?? '-',
                    'kelas'  => $mahasiswa->kelas ?? '-',
                    'status' => $mahasiswa->status ?? 'Aktif'
                ],
                'ujian' => $ujianData,
                'filters' => [
                    'semesters' => $filterSemesterOptions,
                    'years'     => $filterTahunOptions
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat data nilai: ' . $e->getMessage()
            ], 500);
        }
    }
}
