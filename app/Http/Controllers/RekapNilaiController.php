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
     * GET /admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa
     */
    public function listMahasiswaPerSesi($id_osce, $id_sesi, Request $request)
    {
        $query = EnrollmentOsce::where('id_osce', $id_osce)->with('mahasiswa');

        if ($search = $request->input('search')) {
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        if ($angkatan = $request->input('angkatan')) {
            $query->whereHas('mahasiswa', function ($q) use ($angkatan) {
                $q->where('kelas', $angkatan);
            });
        }

        $mahasiswa = $query->get()->map(function ($enroll) {
            return [
                'id_mahasiswa' => $enroll->mahasiswa->id_mahasiswa,
                'nim' => $enroll->mahasiswa->nim,
                'nama' => $enroll->mahasiswa->nama,
            ];
        });

        return Inertia::render('Admin/RekapNilai/MahasiswaPerSesi', [
            'id_osce' => $id_osce,
            'id_sesi' => $id_sesi,
            'mahasiswa' => $mahasiswa,
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * GET /admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        $mahasiswa = Mahasiswa::findOrFail($id_mahasiswa);
        $osce = Osce::findOrFail($id_osce);

        $enrollmentOsce = EnrollmentOsce::where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->first();

        if (!$enrollmentOsce) {
            return back()->withErrors(['message' => 'Data tidak ditemukan']);
        }

        $nilaiPerStase = NilaiOsce::with(['poinAspekPenilaian.aspekPenilaian.stase'])
            ->where('id_enrollment_osce', $enrollmentOsce->id_enrollment_osce)
            ->get()
            ->groupBy(fn($n) => $n->poinAspekPenilaian->aspekPenilaian->stase->nama_stase ?? 'Tidak diketahui')
            ->map(function ($items, $namaStase) {
                $nilaiAkhir = $items->avg('nilai');

                $aspekPenilaian = $items->groupBy(fn($n) => $n->poinAspekPenilaian->aspekPenilaian->aspek)
                    ->map(function ($aspekItems, $aspek) {
                        return [
                            'aspek' => $aspek,
                            'nilai' => $aspekItems->avg('nilai'),
                            'kompetensi' => $aspekItems->map(function ($n) {
                                return [
                                    'kompetensi' => $n->poinAspekPenilaian->kompetensi,
                                    'nilai' => $n->nilai,
                                ];
                            })->values(),
                        ];
                    })->values();

                return [
                    'nama_stase' => $namaStase,
                    'nilai_akhir_stase' => $nilaiAkhir,
                    'aspek_penilaian' => $aspekPenilaian,
                ];
            })->values();

        return Inertia::render('Admin/RekapNilai/DetailMahasiswa', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama,
                'nim'  => $mahasiswa->nim,
            ],
            'osce' => [
                'nama_osce' => $osce->nama_osce,
            ],
            'nilai_per_stase' => $nilaiPerStase,
            'nilai_total_osce' => round($nilaiPerStase->avg('nilai_akhir_stase'), 2),
        ]);
    }
}
