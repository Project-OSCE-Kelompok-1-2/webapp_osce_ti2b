<?php

namespace App\Http\Controllers;

use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa;
use App\Models\NilaiOsce;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapNilaiController extends Controller
{
    /**
     * GET /admin/rekap-nilai
     * List OSCE untuk rekap nilai
     */
    public function index(Request $request)
    {
        $query = Osce::with('tahunAkademik');

        if ($search = $request->input('search')) {
            $query->where('nama_osce', 'like', "%{$search}%");
        }

        if ($tahun = $request->input('tahun')) {
            $query->whereHas('tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', $tahun);
            });
        }

        // Gunakan paginate agar tersedia struktur 'data'
        $osces = $query->paginate(10)->through(function ($osce) {
            return [
                'id_osce'          => $osce->id_osce,
                'nama_rubrik'      => $osce->nama_osce,
                'rentang_tanggal'  => $osce->tanggal_mulai . ' - ' . $osce->tanggal_selesai,
                'tahun_akademik'   => optional($osce->tahunAkademik)->tahun,
                // menyesuaiakan dengan test
                // 'detail_mahasiswa' => $osce->enrollmentOsce()->count() . ' mahasiswa',
                // 'detail_sesi'      => $osce->osceStase()->count() . ' sesi',
            ];
        });

        // Sesuai test: key = 'osce', bukan 'osces'
        return Inertia::render('Admin/RekapOscePage', [
            'osce' => $osces,
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }


    /**
     * GET /admin/rekap-nilai/{id_osce}/sesi
     * List sesi berdasarkan tanggal untuk OSCE tertentu
     */
    public function listSesi($id_osce, Request $request)
    {
        $query = OsceStase::where('id_osce', $id_osce);

        if ($search = $request->input('search')) {
            $query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi = $query->get()
            ->groupBy('tanggal')
            ->map(function ($group, $tanggal) {
                return [
                    'id_sesi' => md5($tanggal),
                    'tanggal_sesi' => $tanggal,
                    'jumlah_mahasiswa' => $group->count(),
                ];
            })->values();

        // ✅ Sesuaikan dengan test (bukan 'Admin/RekapNilai/SesiList')
        return Inertia::render('Admin/RekapSesiPage', [
            'id_osce' => $id_osce,
            'sesi' => $sesi,
            'filters' => $request->only(['search']),
        ]);
    }
    /**
     * TUGAS 1
     * Endpoint: GET /admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa
     * Menampilkan daftar mahasiswa yang terdaftar pada sesi (id_osce_stase) tertentu
     */
    public function listMahasiswaPerStase($id_osce, $id_osce_stase)
    {
        // Ambil daya sesi OSCE beserta nama stase terkait
        $osceStase = OsceStase::with('stase')->find($id_osce_stase);

        // Jika sesi tidak ditemukan, kembalikan error
        if (!$osceStase) {
            return back()->withErrors(['message' => 'Sesi tidak ditemukan.']);
        }

        // Ambil semua mahasiswa yang mengikuti OSCE ini
        $mahasiswa = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->get()
            ->map(function ($enroll) {
                // Buat array sederhana untuk frontend
                return [
                    'id_mahasiswa' => $enroll->mahasiswa->id_mahasiswa,
                    'nim' => $enroll->mahasiswa->nim,
                    'nama' => $enroll->mahasiswa->nama,
                ];
            });

        // Render halaman inertia untuk menampilkan daftar mahasiswa beserta info sesi
            return Inertia::render('Admin/RekapMahasiswaPage', [ // Perlu relasi ke RekapMahasiswaPage.jsx
            'mahasiswa' => ['data' => $mahasiswa],
            'sesi' => [
                'id_osce_stase' => $osceStase->id_osce_stase,
                'nama_stase' => $osceStase->stase?->nama_stase ?? '-',
                'tanggal' => $osceStase->tanggal,
            ],
        ]);
    }

    /**
     * TUGAS 2
     * GET /admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}
     * Menampilkan detail nilai mahasiswa per stase.
     *
     * Perhitungan nilai_akhir_stase:
     * (skor × bobot) untuk tiap poin → dijumlahkan → dibagi 4.
     * Skor berasal dari input penguji (0–3), bobot tetap.
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        // Ambil enrollment mahasiswa beserta data mahasiswa & OSCE terkait
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->first();

        // Jika enrollment tidak ditemukan, hentikan eksekusi dengan 404
            if (!$enrollment) {
            abort(404, 'Data mahasiswa untuk OSCE ini tidak ditemukan.');
        }

        // Ambil semua nilai mahasiswa untuk OSCE tertentu beserta relasi stase, aspek penilaian, dan poin aspek penilaian
        $nilaiOsce = NilaiOsce::with([
                'poinAspekPenilaian.aspekPenilaian.stase',
                'enrollmentOsce.mahasiswa',
            ])
            ->where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->get();

        // Kelompokkan nilai berdasarkan Stase → Aspek → Kompetensi
        $nilaiPerStase = [];
        foreach ($nilaiOsce as $nilai) {
            $poin   = $nilai->poinAspekPenilaian; // Poin aspek penilaian
            $aspek  = $poin?->aspekPenilaian; // Aspek penilaian terkait
            $stase  = $aspek?->stase; // Stase per aspek

            // Ambil info sesi OSCE beserta penguji
            $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
                ->where('id_stase', $stase->id_stase ?? null)
                ->with('penguji')
                ->first();

            // Gunakan nama stase sebagai key, jika null gunakan default
                $staseKey = $stase?->nama_stase ?? 'Stase Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey])) {
                $nilaiPerStase[$staseKey] = [
                    'nama_stase' => $staseKey,
                    'nama_penguji' => $osceStase?->penguji?->nama ?? '-', // Default
                    'aspek_penilaian' => [],
                ];
            }

            // Gunakan nama aspek sebagai key, jika null gunakan default
            $aspekKey = $aspek?->aspek ?? 'Aspek Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey])) {
                $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey] = [
                    'aspek' => $aspekKey,
                    'kompetensi' => [],
                ];
            }

            // Perhitungan nilai akhir per kompetensi
            $skor = $poin?->skor ?? 0;     // input penguji (0–3)
            $bobot = $poin?->bobot ?? 0;   // dari rubrik
            $nilaiAkhir = ($skor * $bobot) / 4; // hasil dibagi 4 sesuai rumus

            // Tambahakan nilai kompetensi ke array aspek
            $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey]['kompetensi'][] = [
                'kompetensi' => $poin?->kompetensi ?? 'Kompetensi Tidak Dikenal',
                'nilai' => $nilaiAkhir,
            ];
        }

        // Susun hasil akhir dengan array indexed agar lebih mudah diakses di frontend
        $detailNilai = [
            'mahasiswa' => [
                'nim' => $enrollment->mahasiswa->nim,
                'nama' => $enrollment->mahasiswa->nama,
                'id_mahasiswa' => $enrollment->mahasiswa->id_mahasiswa,
            ],
            'osce' => [
                'nama_osce' => $enrollment->osce->nama_osce ?? '-',
            ],
            'nilai_per_stase' => array_values(array_map(function ($stase) {
                $stase['aspek_penilaian'] = array_values($stase['aspek_penilaian']);
                return $stase;
            }, $nilaiPerStase)),
        ];

        // Render halaman detail nilai mahasiswa menggunakan inertia
        return Inertia::render('Admin/RekapDetailPage', [ // Perlu relasi ke RekapDetailPage.jsx
            'detailNilai' => $detailNilai,
        ]);
    }
}