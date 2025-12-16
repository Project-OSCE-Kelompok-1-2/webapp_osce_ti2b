<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use App\Services\Mahasiswa\NilaiCalculatorService;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
                    'kelas' => '-',
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

        // 3. BUILD QUERY DENGAN ELOQUENT
        $query = EnrollmentOsce::query()
            ->with([
                'osce.tahunAkademik',
                'osce.osceStase',
                'nilaiOsce.poinAspekPenilaian.aspekPenilaian'
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

        // Sorting
        $query->select('enrollment_osce.*')
            ->join('osce', 'enrollment_osce.id_osce', '=', 'osce.id_osce')
            ->orderBy('osce.tanggal_mulai', 'desc');

        $ujianRaw = $query->get();

        // 4. TRANSFORMASI DATA
        $tahunMasuk = (int) ($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        $ujianData = $ujianRaw->map(function ($enrollment) use ($tahunMasuk) {

            // --- LOGIKA CALCULATOR ---
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

            // D. Hitung Rata-rata & Status Akhir
            $overallResult = $this->calculator->calculateOverallResult($daftarNilaiStase);

            // --- LOGIKA TANGGAL & SESI ---
            $osce = $enrollment->osce;
            $tahunAkademik = $osce->tahunAkademik;

            // Default ke global event time jika data sesi kosong
            $waktuMulai = $osce->tanggal_mulai;
            $waktuSelesai = $osce->tanggal_selesai;

            // Cek jika ada data sesi spesifik di tabel enrollment
            if (!empty($enrollment->tanggal_sesi) && !empty($enrollment->jam_sesi)) {
                $tglSesi = Carbon::parse($enrollment->tanggal_sesi);
                $tglStr = $tglSesi->format('Y-m-d');

                // 1. Set Waktu Mulai Spesifik
                $waktuMulai = $tglStr . ' ' . $enrollment->jam_sesi;

                // 2. Cari Waktu Selesai Spesifik dari Jadwal Stase (osce_stase)
                // Kita cari jadwal stase yang tanggal & jam mulainya cocok dengan sesi mahasiswa ini
                $jadwalSesi = $osce->osceStase->first(function ($stase) use ($tglStr, $enrollment) {
                    $staseDate = $stase->tanggal instanceof Carbon ? $stase->tanggal->format('Y-m-d') : $stase->tanggal;

                    // Normalisasi jam (ambil 5 karakter pertama HH:mm untuk perbandingan aman)
                    $staseStart = substr($stase->jam_mulai, 0, 5);
                    $enrollStart = substr($enrollment->jam_sesi, 0, 5);

                    return $staseDate === $tglStr && $staseStart === $enrollStart;
                });

                if ($jadwalSesi) {
                    // Jika ketemu jadwalnya, ambil jam selesainya
                    $waktuSelesai = $tglStr . ' ' . $jadwalSesi->jam_selesai;
                } else {
                    // Fallback: Jika tanggal global event sama dengan tanggal sesi, pakai jam selesai event global
                    // Jika beda hari, kita estimasi durasi 60 menit (agar UI tidak menampilkan tanggal end yang aneh)
                    $globalEnd = Carbon::parse($osce->tanggal_selesai);
                    if ($globalEnd->format('Y-m-d') === $tglStr) {
                        $waktuSelesai = $osce->tanggal_selesai;
                    } else {
                        $waktuSelesai = Carbon::parse($waktuMulai)->addMinutes(60)->format('Y-m-d H:i:s');
                    }
                }
            }

            // E. Format Data Tampilan
            $tahunAkademikStr = $tahunAkademik->tahun ?? '-';
            $semesterLabel = $tahunAkademik->semester ?? '-';

            // Hitung Semester Angka
            $tahunMulai = (int) substr($tahunAkademikStr, 0, 4);
            $selisih = $tahunMulai - $tahunMasuk;
            $semesterAngka = ($selisih * 2) + ($semesterLabel === 'Ganjil' ? 1 : 2);
            if ($semesterAngka < 1) $semesterAngka = 1;

            return [
                'id'               => $enrollment->id_enrollment_osce,
                'id_osce'          => $osce->id_osce,
                'nama_ujian'       => $osce->nama_osce,

                // Menggunakan waktu spesifik sesi (jika ada)
                'tanggal_ujian'    => $waktuMulai,
                'tanggal_selesai_ujian' => $waktuSelesai, // Field baru

                'semester_angka'   => (string) $semesterAngka,
                'semester_label'   => $semesterLabel,
                'tahun_ujian'      => $tahunAkademikStr,
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
