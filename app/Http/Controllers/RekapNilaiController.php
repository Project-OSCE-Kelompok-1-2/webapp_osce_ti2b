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
    
}
