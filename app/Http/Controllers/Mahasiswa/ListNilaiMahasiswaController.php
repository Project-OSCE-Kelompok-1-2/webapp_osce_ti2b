<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik; // Model ini wajib diimport
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ListNilaiMahasiswaController extends Controller
{
    /**
     * Menampilkan daftar nilai OSCE mahasiswa yang sedang login.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // 1. Validasi User & Mahasiswa
        $user = Auth::user();
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // Ambil Opsi Filter untuk Dropdown (Data Unik)
        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        // Jika data mahasiswa belum link/tidak ditemukan, return tampilan kosong
        if (!$mahasiswa) {
            return Inertia::render('Mahasiswa/NilaiIndex', [
                'mahasiswa' => [
                    'nama' => $user->username,
                    'nim' => '-',
                    'prodi' => '-',
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

        // 2. BUILD QUERY UTAMA
        $query = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'enrollment_osce.id_osce',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label', // "Ganjil" / "Genap"
                'tahun_akademik.tahun as tahun_akademik', // "2025/2026"
            ])
            ->addSelect([
                // Sub-query untuk menghitung total nilai (COALESCE agar tidak null)
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai), 0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                    ->limit(1)
            ]);

        // 3. TERAPKAN FILTER (Server-Side Logic)

        // Filter Semester
        if ($request->filled('semester') && $request->semester !== 'Semua') {
            $query->where('tahun_akademik.semester', $request->semester);
        }

        // Filter Tahun
        if ($request->filled('tahun') && $request->tahun !== 'Semua') {
            $query->where('tahun_akademik.tahun', $request->tahun);
        }

        // Filter Search (Nama Ujian)
        if ($request->filled('search')) {
            $query->where('osce.nama_osce', 'like', '%' . $request->search . '%');
        }

        // Eksekusi Query
        $ujianRaw = $query->orderBy('osce.tanggal_mulai', 'desc')->get();

        // 4. DATA TRANSFORMATION & LOGIKA SEMESTER ANGKA
        $tahunMasuk = (int)($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        $ujianData = $ujianRaw->map(function ($item) use ($tahunMasuk) {
            $tahunAkademikStr = $item->tahun_akademik ?? (date('Y') . "/" . (date('Y') + 1));
            $semLabel = $item->semester_label ?? 'Ganjil';

            // Hitung semester angka berdasarkan Tahun Masuk & Tahun Akademik Ujian
            $tahunMulaiAkademik = (int) substr($tahunAkademikStr, 0, 4);
            $selisihTahun = $tahunMulaiAkademik - $tahunMasuk;

            // Logika: 1 Tahun = 2 Semester
            $semAngka = ($selisihTahun * 2) + ($semLabel === 'Ganjil' ? 1 : 2);
            if ($semAngka < 1) $semAngka = 1;

            return [
                'id'             => $item->id, // id_enrollment_osce
                'id_osce'        => $item->id_osce,
                'nama_ujian'     => $item->nama_ujian,
                'tanggal_ujian'  => $item->tanggal_ujian,
                'semester_angka' => (string)$semAngka,
                'semester_label' => $semLabel,
                'tahun_ujian'    => $tahunAkademikStr,
                'nilai_total'    => number_format((float)$item->nilai_total, 2),
                'status_lulus'   => (float)$item->nilai_total >= 70, // Ambang batas kelulusan
                'dosen_penguji'  => '-' // Default strip jika tidak ada join ke dosen
            ];
        });

        // 5. RETURN KE INERTIA
        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi ?? '-',
                'status' => $mahasiswa->status ?? 'Aktif'
            ],
            'ujian' => $ujianData,
            'filters' => [
                'semesters' => $filterSemesterOptions,
                'years'     => $filterTahunOptions
            ],
            // Kirim balik parameter agar input search/filter tidak reset di frontendd
            'queryParams' => $request->only(['semester', 'tahun', 'search'])
        ]);
    }
}
