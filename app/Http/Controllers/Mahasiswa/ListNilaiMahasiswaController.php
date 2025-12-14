<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik; // <-- PASTIKAN MODEL INI DIIMPORT!
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
        // 1. Ambil data pengguna dan mahasiswa yang login
        $user = Auth::user();
        // Asumsi relasi user->id_pengguna ke Mahasiswa->id_pengguna
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // 2. Data filter untuk dropdown
        // Perlu dipastikan model TahunAkademik sudah ada dan memiliki kolom 'semester' dan 'tahun'
        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        // Jika data mahasiswa tidak ditemukan
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
                ]
            ]);
        }

        // 3. AMBIL SEMUA DATA NILAI
        $ujian = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->addSelect([
                // Sub-query untuk menghitung total nilai
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai), 0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                    ->limit(1)
            ])
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label', // "Ganjil" / "Genap"
                'tahun_akademik.tahun as tahun_akademik', // "2025/2026"
            ])
            ->orderBy('osce.tanggal_mulai', 'desc')
            ->get(); // Ambil semua data

        // 4. LOGIKA TAMBAHAN (Formatting dan Perhitungan Semester Angka)
        // Asumsi: Ambil tahun masuk dari data mahasiswa, jika tidak ada, gunakan default.
        // Anda mungkin perlu menyesuaikan cara mendapatkan tahun masuk yang akurat.
        $tahunMasuk = (int)($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        // Karena get() mengembalikan Collection, kita pakai map() untuk formatting
        $ujianData = $ujian->map(function ($item) use ($tahunMasuk) {
            $tahunAkademik = $item->tahun_akademik ?? (date('Y') . "/" . (date('Y') + 1));
            $semLabel = $item->semester_label ?? 'Ganjil';

            // Hitung semester angka
            $tahunMulaiAkademik = (int) substr($tahunAkademik, 0, 4);
            $selisihTahun = $tahunMulaiAkademik - $tahunMasuk;

            // Logika: Setiap tahun bertambah 2 semester.
            $semAngka = ($selisihTahun * 2) + ($semLabel === 'Ganjil' ? 1 : 2);

            // Pastikan tidak ada semester di bawah 1
            if ($semAngka < 1) $semAngka = 1;

            return [
                'id'  => $item->id,
                'nama_ujian'  => $item->nama_ujian,
                'tanggal_ujian' => $item->tanggal_ujian,
                // Tambahkan semester angka untuk filter/sorting di frontend
                'semester_angka' => (string)$semAngka,
                // Semester ditampilkan apa adanya dari database (Ganjil/Genap)
                'semester_label' => $item->semester_label,
                'tahun_ujian' => $item->tahun_akademik,
                'nilai_total' => (int)$item->nilai_total, // Pastikan tipe data int
                'status_lulus'  => (int)$item->nilai_total >= 70, // Ambil kriteria lulus (asumsi >= 70)
                'dosen_penguji' => '-', // Data ini mungkin perlu dijoin dari tabel lain
            ];
        });

        // 5. Mengembalikan halaman Inertia
        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'  => $mahasiswa->nama,
                'nim' => $mahasiswa->nim,
                // Asumsi Mahasiswa memiliki kolom 'prodi'
                'prodi' => $mahasiswa->prodi ?? '-',
                'status' => $mahasiswa->status ?? 'Aktif'
            ],
            'ujian'  => $ujianData,
            // Kirim opsi filter ke frontend
            'filters' => [
                'semesters' => $filterSemesterOptions,
                'years' => $filterTahunOptions
            ]
        ]);
    }
}
