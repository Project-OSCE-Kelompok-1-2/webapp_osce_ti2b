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
        // 1. Validasi User & Mahasiswa
        $user = Auth::user();
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // Ambil Opsi Filter untuk Dropdown
        $filterSemesterOptions = TahunAkademik::select('semester')->distinct()->pluck('semester');
        $filterTahunOptions = TahunAkademik::select('tahun')->distinct()->orderBy('tahun', 'desc')->pluck('tahun');

        // Jika data mahasiswa belum link, return kosong
        if (!$mahasiswa) {
            return Inertia::render('Mahasiswa/NilaiIndex', [
                'mahasiswa' => ['nama' => $user->username, 'nim' => '-', 'prodi' => '-'],
                'ujian' => [],
                'filters' => ['semesters' => $filterSemesterOptions, 'years' => $filterTahunOptions],
                'queryParams' => $request->all()
            ]);
        }

        // 2. BUILD QUERY (Dengan Filter)
        $query = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'enrollment_osce.id_osce',
                // [HAPUS BARIS INI] 'enrollment_osce.id_osce_stase', <-- KARENA TIDAK ADA DI ERD
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label',
                'tahun_akademik.tahun as tahun_akademik',
            ])
            ->addSelect([
                // Sub-query total nilai (Sesuai logika database Anda)
                'nilai_total' => DB::table('nilai_osce')
                    ->selectRaw('COALESCE(SUM(nilai), 0)')
                    ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                    ->limit(1)
            ]);

        // --- FILTERING LOGIC ---

        // Filter Semester (Ganjil/Genap)
        if ($request->filled('semester') && $request->semester !== 'Semua') {
            $query->where('tahun_akademik.semester', $request->semester);
        }

        // Filter Tahun (2025/2026)
        if ($request->filled('tahun') && $request->tahun !== 'Semua') {
            $query->where('tahun_akademik.tahun', $request->tahun);
        }

        // Filter Search
        if ($request->filled('search')) {
            $query->where('osce.nama_osce', 'like', '%' . $request->search . '%');
        }

        // Eksekusi Query
        $ujianRaw = $query->orderBy('osce.tanggal_mulai', 'desc')->get();

        // 3. DATA TRANSFORMATION
        $tahunMasuk = (int)($mahasiswa->tahun_masuk ?? (date('Y') - 2));

        $ujianData = $ujianRaw->map(function ($item) use ($tahunMasuk) {
            $tahunAkademikStr = $item->tahun_akademik ?? (date('Y') . "/" . (date('Y') + 1));
            $semLabel = $item->semester_label ?? 'Ganjil';

            // Hitung semester angka
            $tahunMulaiAkademik = (int) substr($tahunAkademikStr, 0, 4);
            $selisihTahun = $tahunMulaiAkademik - $tahunMasuk;
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
                'status_lulus'   => (float)$item->nilai_total >= 70,
            ];
        });

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'  => $mahasiswa->nama,
                'nim'   => $mahasiswa->nim,
                'prodi' => $mahasiswa->prodi ?? '-',
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
