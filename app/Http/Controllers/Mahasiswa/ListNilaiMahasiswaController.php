<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use App\Services\Mahasiswa\NilaiCalculatorService; // Import Service
use Illuminate\Support\Facades\Auth;

class ListNilaiMahasiswaController extends Controller
{
    protected $calculator;

    // 1. Injeksi Service Calculator agar logika sama persis
    public function __construct(NilaiCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    public function index(Request $request)
    {
        // 2. VALIDASI USER & MAHASISWA
        $user = Auth::user();
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        if (!$mahasiswa) {
            return Inertia::render('Mahasiswa/NilaiIndex', [
                'mahasiswa' => [
                    'nama' => $user->username,
                    'nim' => '-',
                    'prodi' => '-',
                    'kelas' => '-', // PERBAIKAN: Tambahkan default kelas jika mahasiswa tidak ditemukan
                    'status' => 'Data Tidak Ditemukan'
                ],
                'ujian' => [],
                'filters' => [
                    'semesters' => $filterSemesterOptions,
                    'years' => $filterTahunOptions
                ],
                'queryParams' => $request->all()
            ]);
        }

        // 3. BUILD QUERY DENGAN ELOQUENT (Bukan Raw SQL lagi)
        // Kita perlu meload relasi yang sama dengan NilaiMahasiswaController
        // agar service calculator bisa bekerja.
        $query = EnrollmentOsce::query()
            ->with([
                'osce.tahunAkademik',
                'osce.osceStase', // Untuk tahu jumlah stase
                'nilaiOsce.poinAspekPenilaian.aspekPenilaian' // Untuk hitung nilai
            ])
            ->where('id_mahasiswa', $mahasiswa->id_mahasiswa);

        // Filter: Semester
        if ($request->filled('semester') && $request->semester !== 'Semua') {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($request) {
                $q->where('semester', $request->semester);
            });
        }

        // Filter: Tahun
        if ($request->filled('tahun') && $request->tahun !== 'Semua') {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
            });
        }

        // Filter: Search (Nama Ujian)
        if ($request->filled('search')) {
            $query->whereHas('osce', function ($q) use ($request) {
                $q->where('nama_osce', 'like', '%' . $request->search . '%');
            });
        }

        // Sorting berdasarkan tanggal ujian terbaru
        // Kita join manual sedikit hanya untuk sorting agar efisien, atau pakai subquery sorting
        // Tapi cara paling aman di Eloquent + Relation sort:
        $query->select('enrollment_osce.*')
              ->join('osce', 'enrollment_osce.id_osce', '=', 'osce.id_osce')
              ->orderBy('osce.tanggal_mulai', 'desc');

        $ujianRaw = $query->get();

        // 4. TRANSFORMASI DATA (MENGGUNAKAN LOGIKA CALCULATOR)
        $tahunMasuk = (int) ($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        $ujianData = $ujianRaw->map(function ($enrollment) use ($tahunMasuk) {
            
            // --- MULAI LOGIKA CALCULATOR (Sama dengan NilaiMahasiswaController) ---
            
            $daftarNilaiStase = [];
            
            // A. Ambil List Stase Unik
            $semuaJadwalStase = $enrollment->osce->osceStase ?? collect([]);
            $listStaseUnik = $semuaJadwalStase->unique('id_stase');

            // B. Kelompokkan Nilai per Stase
            $nilaiByStase = collect($enrollment->nilaiOsce)->groupBy(function ($nilai) {
                return $nilai->poinAspekPenilaian?->aspekPenilaian?->id_stase ?? 'undefined';
            });

            // C. Hitung Nilai Per Stase
            foreach ($listStaseUnik as $osceStase) {
                $staseId = $osceStase->id_stase;
                if (!$staseId) continue;

                $kumpulanNilai = $nilaiByStase->get($staseId);
                $nilaiAkhirStase = 0;
                $predikatStase = 'BELUM DINILAI';

                if ($kumpulanNilai && $kumpulanNilai->isNotEmpty()) {
                    // Panggil Service untuk hitung per stase
                    $calc = $this->calculator->calculateFinalGrade($kumpulanNilai);
                    $nilaiAkhirStase = $calc['final_score'];
                    $predikatStase = $calc['predicate'];
                }

                $daftarNilaiStase[] = [
                    'id' => $staseId,
                    'nilai' => $nilaiAkhirStase,
                    'keterangan' => $predikatStase
                ];
            }

            // D. Hitung Rata-rata & Status Akhir (Footer Logic)
            $overallResult = $this->calculator->calculateOverallResult($daftarNilaiStase);
            
            // --- SELESAI LOGIKA CALCULATOR ---


            // E. Format Data Tampilan (Semester, Tanggal, dll)
            $osce = $enrollment->osce;
            $tahunAkademik = $osce->tahunAkademik;
            
            $tahunAkademikStr = $tahunAkademik->tahun ?? '-';
            $semesterLabel = $tahunAkademik->semester ?? '-';

            // Hitung Semester Angka (Logic Tampilan Lama)
            $tahunMulai = (int) substr($tahunAkademikStr, 0, 4);
            $selisih = $tahunMulai - $tahunMasuk;
            $semesterAngka = ($selisih * 2) + ($semesterLabel === 'Ganjil' ? 1 : 2);
            if ($semesterAngka < 1) $semesterAngka = 1;

            return [
                'id'               => $enrollment->id_enrollment_osce, // Pastikan primary key benar
                'id_osce'          => $osce->id_osce,
                'nama_ujian'       => $osce->nama_osce,
                'tanggal_ujian'    => $osce->tanggal_mulai,
                'semester_angka'   => (string) $semesterAngka,
                'semester_label'   => $semesterLabel,
                'tahun_ujian'      => $tahunAkademikStr,
                
                // Gunakan hasil perhitungan Service
                'nilai_total'      => number_format((float) ($overallResult['overall_score'] ?? 0), 2),
                'status_kelulusan' => $overallResult['status'] ?? 'BELUM LENGKAP',
                
                'dosen_penguji'    => '-',
            ];
        });

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi ?? '-',
                // PERBAIKAN UTAMA: Menambahkan field kelas
                'kelas'  => $mahasiswa->kelas ?? '-', 
                'status' => $mahasiswa->status ?? 'Aktif'
            ],
            'ujian' => $ujianData,
            'filters' => [
                'semesters' => $filterSemesterOptions,
                'years'     => $filterTahunOptions
            ],
            'queryParams' => $request->only(['semester', 'tahun', 'search'])
        ]);
    }
}