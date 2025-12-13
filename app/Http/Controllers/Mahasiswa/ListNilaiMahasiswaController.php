<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\Auth; // Wajib import Auth
use Illuminate\Support\Facades\DB;

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        // 1. AMBIL SIAPA YANG SEDANG LOGIN
        $user = Auth::user();

        // 2. CARI DATA MAHASISWA
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // Handle jika data mahasiswa belum ada
        if (!$mahasiswa) {
            return Inertia::render('Mahasiswa/NilaiIndex', [
                'mahasiswa' => [
                    'nama'   => $user->username . ' (Belum terhubung ke Data Mahasiswa)',
                    'nim'    => '-',
                    'prodi'  => '-',
                    'status' => 'Data Tidak Ditemukan'
                ],
                'ujian' => [], // Kirim array kosong
                'filters' => []
            ]);
        }

        // 3. AMBIL SEMUA DATA NILAI (Client-Side Pagination)
        // Kita hapus filter search/tahun/semester di sini agar frontend dapat semua data

        $ujian = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->addSelect([
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai), 0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                    ->limit(1)
            ])
            // [HAPUS] Filter search, tahun, semester di level database
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label',
                'tahun_akademik.tahun as tahun_akademik',
            ])
            ->orderBy('osce.tanggal_mulai', 'desc')
            ->get(); // [PENTING] Gunakan get(), bukan paginate()

        // 4. LOGIKA TAMBAHAN (Formatting)
        // Asumsi tahun masuk statis untuk contoh, sebaiknya ambil dari $mahasiswa->angkatan
        $tahunMasuk = (int)date('Y') - 2;

        // Karena get() mengembalikan Collection, kita pakai map()
        $ujianData = $ujian->map(function ($item) use ($tahunMasuk) {
            $tahunAkademik = $item->tahun_akademik ?? date('Y') . "/" . (date('Y') + 1);
            $semLabel = $item->semester_label ?? 'Ganjil';

            // Hitung semester angka
            $tahunUjian = (int) substr($tahunAkademik, 0, 4);
            $selisih = $tahunUjian - $tahunMasuk;
            $semAngka = ($selisih * 2) + ($semLabel === 'Ganjil' ? 1 : 2);
            if ($semAngka < 1) $semAngka = 1;

            return [
                'id' => $item->id,
                'nama_ujian' => $item->nama_ujian,
                'tanggal_ujian' => $item->tanggal_ujian,
                'semester' => (string) $semAngka,
                'semester_label' => $semLabel, // Tambahan untuk filter
                'status_lulus' => $item->nilai_total >= 70,
                'dosen_penguji' => '-', // Placeholder jika tidak ada di query
                'tahun_ujian' => $tahunAkademik,
            ];
        });

        // mengembalikan halaman
        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi,
                'status' => $mahasiswa->status ?? 'Aktif'
            ],
            'ujian' => $ujianData, // Kirim Array Full
            'filters' => []        // Kosongkan filter
        ]);
    }
}
