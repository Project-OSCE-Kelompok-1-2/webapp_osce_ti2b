<?php

namespace App\Services;

use App\Models\Osce;
use App\Models\Mahasiswa;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RekapNilaiService
{
    /**
     * List OSCE untuk rekap nilai
     */
    public function getRekapList(Request $request)
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
        return $query->paginate(10)->through(function ($osce) {
            return [
                'id_osce'          => $osce->id_osce,
                'nama_rubrik'      => $osce->nama_osce,
                'rentang_tanggal'  => $osce->tanggal_mulai . ' - ' . $osce->tanggal_selesai,
                'tahun_akademik'   => optional($osce->tahunAkademik)->tahun,
            ];
        });
    }

    /**
     * List sesi berdasarkan tanggal untuk OSCE tertentu
     * Mengembalikan array berisi data osce dan data sesi (paginated)
     */
    public function getSesiList(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $search = $request->input('search');

        $query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal');

        if ($search) {
            $query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi_paginated = $query->select('tanggal', DB::raw('COUNT(*) as stase_count'))
            ->groupBy('tanggal')
            ->orderBy('tanggal', 'asc')
            ->paginate(10)
            ->withQueryString();

        $sesi_data = $sesi_paginated->through(function ($sesi_group) use ($id_osce) {
            // Hitung jumlah mahasiswa untuk tanggal sesi ini
            $jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi_group->tanggal)
                ->distinct('id_mahasiswa')
                ->count();

            return [
                'id_sesi' => $sesi_group->tanggal,
                'tanggal_sesi' => (new \DateTime($sesi_group->tanggal))->format('d M Y'),
                'jumlah_mahasiswa' => $jumlah_mahasiswa,
            ];
        });

        return [
            'osce' => $osce,
            'sesi' => $sesi_data
        ];
    }

    /**
     * Menampilkan daftar mahasiswa yang terdaftar pada sesi tertentu
     */
    public function getMahasiswaPerSesi(Request $request, $id_osce, $id_sesi)
    {
        $sesi_tanggal = $id_sesi;
        $osce = Osce::findOrFail($id_osce);

        $search = $request->input('search');
        $angkatan = $request->input('angkatan');

        // Ambil ID mahasiswa yang ter-enroll di SESI INI
        $enrolled_ids = EnrollmentOsce::where('id_osce', $id_osce)
            ->where('tanggal_sesi', $sesi_tanggal)
            ->pluck('id_mahasiswa');

        $mahasiswa_query = Mahasiswa::whereIn('id_mahasiswa', $enrolled_ids);

        if ($search) {
            $mahasiswa_query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%");
            });
        }
        if ($angkatan) {
            $mahasiswa_query->where('kelas', $angkatan);
        }

        $mahasiswa_list = $mahasiswa_query->orderBy('nama', 'asc')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
            ]);

        return [
            'osce' => $osce,
            'sesi_info' => [
                'tanggal' => $sesi_tanggal,
                'tanggal_formatted' => (new \DateTime($sesi_tanggal))->format('d M Y')
            ],
            'mahasiswa_list' => $mahasiswa_list
        ];
    }

    /**
     * Menghitung detail nilai mahasiswa per stase
     */
    public function calculateDetailNilai($id_mahasiswa, $id_osce)
    {
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->first();

        if (!$enrollment) {
            return null; // Indikasi not found
        }

        $nilaiOsce = NilaiOsce::with([
            'poinAspekPenilaian.aspekPenilaian.stase',
            'enrollmentOsce.mahasiswa',
        ])
            ->where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->get();

        $nilaiPerStase = [];

        foreach ($nilaiOsce as $nilai) {
            $poin   = $nilai->poinAspekPenilaian;
            if (!$poin) continue;

            $aspek  = $poin?->aspekPenilaian;
            $stase  = $aspek?->stase;

            if (!$stase) continue;

            $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
                ->where('id_stase', $stase->id_stase)
                ->with('penguji')
                ->first();

            $staseKey = $stase?->nama_stase ?? 'Stase Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey])) {
                $nilaiPerStase[$staseKey] = [
                    'nama_stase' => $staseKey,
                    'nama_penguji' => $osceStase?->penguji?->nama ?? '-',
                    'total_skor_bobot' => 0,
                    'aspek_penilaian' => [],
                ];
            }

            $aspekKey = $aspek?->aspek ?? 'Aspek Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey])) {
                $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey] = [
                    'aspek' => $aspekKey,
                    'kompetensi' => [],
                ];
            }

            $skor = $poin?->skor ?? 0;
            $bobot = $poin?->bobot ?? 0;
            $nilaiKali = $skor * $bobot;

            $nilaiPerStase[$staseKey]['total_skor_bobot'] += $nilaiKali;

            $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey]['kompetensi'][] = [
                'kompetensi' => $poin?->kompetensi ?? 'Kompetensi Tidak Dikenal',
                'skor' => $skor,
                'bobot' => $bobot,
                'hasil' => $nilaiKali,
                'nilai' => $nilaiKali,
            ];
        }

        foreach ($nilaiPerStase as $key => $stase) {
            $totalSkorBobot = $stase['total_skor_bobot'] ?? 0;
            $nilaiPerStase[$key]['nilai_akhir_stase'] = $totalSkorBobot / 4;
        }

        $nilai_total_osce = array_sum(array_column($nilaiPerStase, 'nilai_akhir_stase'));

        return [
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
            'nilai_total_osce' => $nilai_total_osce,
        ];
    }
}
