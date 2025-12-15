<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        // 1. VALIDASI USER & MAHASISWA
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

        // 2. QUERY UTAMA
        $query = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'enrollment_osce.id_osce',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label',
                'tahun_akademik.tahun as tahun_akademik',
            ])
            ->addSelect([
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai),0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
            ]);

        if ($request->filled('semester') && $request->semester !== 'Semua') {
            $query->where('tahun_akademik.semester', $request->semester);
        }

        if ($request->filled('tahun') && $request->tahun !== 'Semua') {
            $query->where('tahun_akademik.tahun', $request->tahun);
        }

        if ($request->filled('search')) {
            $query->where('osce.nama_osce', 'like', '%' . $request->search . '%');
        }

        $ujianRaw = $query->orderBy('osce.tanggal_mulai', 'desc')->get();

        // 3. TRANSFORMASI DATA
        $tahunMasuk = (int) ($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        $ujianData = $ujianRaw->map(function ($item) use ($tahunMasuk) {

            // JUMLAH STASE (AMAN)
            $jumlahStase = DB::table('nilai_osce')
                ->join('poin_aspek_penilaian', 'nilai_osce.id_poin_aspek_penilaian', '=', 'poin_aspek_penilaian.id_poin_aspek_penilaian')
                ->join('aspek_penilaian', 'poin_aspek_penilaian.id_aspek_penilaian', '=', 'aspek_penilaian.id_aspek_penilaian')
                ->where('nilai_osce.id_enrollment_osce', $item->id)
                ->selectRaw('COUNT(DISTINCT aspek_penilaian.id_stase) as total')
                ->value('total');

            // JUMLAH STASE LULUS (AMAN DARI ONLY_FULL_GROUP_BY)
            $jumlahStaseLulus = DB::table('nilai_osce')
                ->join('poin_aspek_penilaian', 'nilai_osce.id_poin_aspek_penilaian', '=', 'poin_aspek_penilaian.id_poin_aspek_penilaian')
                ->join('aspek_penilaian', 'poin_aspek_penilaian.id_aspek_penilaian', '=', 'aspek_penilaian.id_aspek_penilaian')
                ->where('nilai_osce.id_enrollment_osce', $item->id)
                ->groupBy('aspek_penilaian.id_stase')
                ->havingRaw('AVG(nilai_osce.nilai) >= 2.75')
                ->selectRaw('aspek_penilaian.id_stase')
                ->get()
                ->count();

            $statusKelulusan = ($jumlahStase > 0 && $jumlahStase == $jumlahStaseLulus)
                ? 'LULUS'
                : 'TIDAK LULUS';

            $tahunAkademikStr = $item->tahun_akademik;
            $semesterLabel = $item->semester_label;

            $tahunMulai = (int) substr($tahunAkademikStr, 0, 4);
            $selisih = $tahunMulai - $tahunMasuk;

            $semesterAngka = ($selisih * 2) + ($semesterLabel === 'Ganjil' ? 1 : 2);
            if ($semesterAngka < 1) $semesterAngka = 1;

            return [
                'id'               => $item->id,
                'id_osce'          => $item->id_osce,
                'nama_ujian'       => $item->nama_ujian,
                'tanggal_ujian'    => $item->tanggal_ujian,
                'semester_angka'   => (string) $semesterAngka,
                'semester_label'   => $semesterLabel,
                'tahun_ujian'      => $tahunAkademikStr,
                'nilai_total'      => number_format((float) $item->nilai_total, 2),
                'status_kelulusan' => $statusKelulusan,
                'dosen_penguji'    => '-',
            ];
        });

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
            'queryParams' => $request->only(['semester', 'tahun', 'search'])
        ]);
    }
}
    