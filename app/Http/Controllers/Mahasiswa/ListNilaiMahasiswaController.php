<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik; // Import Model Tahun Akademik
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // Data filter untuk dropdown (diambil dari DB agar dinamis)
        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

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

        // Query Utama dengan Join ke Tahun Akademik
        $ujian = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            // Join ke tabel tahun_akademik untuk ambil data dinamis
            ->join('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->addSelect([
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai), 0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                    ->limit(1)
            ])
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                // Ambil kolom asli dari tabel tahun_akademik
                'tahun_akademik.semester as semester_label', // "Ganjil" / "Genap"
                'tahun_akademik.tahun as tahun_akademik',     // "2025/2026"
            ])
            ->orderBy('osce.tanggal_mulai', 'desc')
            ->get();

        $ujianData = $ujian->map(function ($item) {
            return [
                'id'             => $item->id,
                'nama_ujian'     => $item->nama_ujian,
                'tanggal_ujian'  => $item->tanggal_ujian,
                // Semester ditampilkan apa adanya dari database (Ganjil/Genap)
                'semester'       => $item->semester_label,
                'semester_label' => $item->semester_label,
                'tahun_ujian'    => $item->tahun_akademik,
                'status_lulus'   => $item->nilai_total >= 70,
                'dosen_penguji'  => '-',
            ];
        });

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi,
                'status' => $mahasiswa->status ?? 'Aktif'
            ],
            'ujian'   => $ujianData,
            // Kirim opsi filter ke frontend
            'filters' => [
                'semesters' => $filterSemesterOptions,
                'years' => $filterTahunOptions
            ]
        ]);
    }
}
