<?php

namespace App\Services\Admin;

use App\Models\Osce;
use App\Models\Mahasiswa;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\TahunAkademik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RekapNilaiService
{
    /**
     * List OSCE untuk rekap nilai dan list Tahun Akademik untuk filter.
     * * @param string|null $search
     * @param string|null $tahun
     * @return array
     */
    public function getRekapList($search, $tahun)
    {
        $query = Osce::with('tahunAkademik');

        if ($search) {
            $query->where('nama_osce', 'like', "%{$search}%");
        }

        if ($tahun) {
            $query->whereHas('tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', $tahun);
            });
        }

        $osces = $query->paginate(10)->through(function ($osce) {
            return [
                'id_osce'           => $osce->id_osce,
                'nama_rubrik'       => $osce->nama_osce,
                'rentang_tanggal'   => $osce->tanggal_mulai . ' - ' . $osce->tanggal_selesai,
                'tahun_akademik'    => optional($osce->tahunAkademik)->tahun,
            ];
        });

        // Ambil list tahun akademik untuk dropdown
        $tahunAkademikOptions = TahunAkademik::orderBy('tahun', 'desc')
            ->get()
            ->map(fn($t) => [
                'value' => $t->tahun,
                'label' => $t->tahun,
            ]);

        return [
            'osce' => $osces,
            'tahunAkademikOptions' => $tahunAkademikOptions,
        ];
    }

    /**
     * List sesi berdasarkan tanggal dan jam untuk OSCE tertentu.
     * Mengembalikan array berisi data osce dan data sesi (paginated).
     * * @param int $id_osce
     * @param string|null $search
     * @return array
     */
    public function getSesiList($id_osce, $search)
    {
        $osce = Osce::findOrFail($id_osce);

        $query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal');

        if ($search) {
            $query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi_paginated = $query->select(
            'tanggal',
            'jam_mulai',
            DB::raw('COUNT(*) as stase_count')
        )
            ->groupBy('tanggal', 'jam_mulai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->paginate(10)
            ->withQueryString();

        $sesi_data = $sesi_paginated->through(function ($sesi_group) use ($id_osce) {
            $jam_formatted = substr($sesi_group->jam_mulai, 0, 5);

            $jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi_group->tanggal)
                ->distinct('id_mahasiswa')
                ->count();

            return [
                // Format ID sesi: Tanggal_Jam(tanpa titik dua)
                'id_sesi' => $sesi_group->tanggal . '_' . str_replace(':', '', $jam_formatted),
                'tanggal_sesi_raw' => $sesi_group->tanggal,
                'jam_sesi_raw' => $jam_formatted,
                'tampilan_sesi' => (new \DateTime($sesi_group->tanggal))->format('d M Y') . ' — Pukul ' . $jam_formatted,
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
     * * @param int $id_osce
     * @param string $id_sesi (Format: Tanggal_JamRaw)
     * @param string|null $search
     * @param string|null $angkatan
     * @return array
     */
    public function getMahasiswaPerSesi($id_osce, $id_sesi, $search, $angkatan)
    {
        // 1. Pecah ID Sesi untuk mendapatkan Tanggal dan Jam
        $parts = explode('_', $id_sesi);
        $sesi_tanggal = $parts[0];
        $sesi_jam_raw = isset($parts[1]) ? $parts[1] : '';

        $sesi_jam_display = '';
        if (strlen($sesi_jam_raw) == 4) {
            $sesi_jam_display = substr($sesi_jam_raw, 0, 2) . ':' . substr($sesi_jam_raw, 2, 2);
        }

        $osce = Osce::findOrFail($id_osce);

        // 2. Ambil ID mahasiswa yang ter-enroll di SESI INI
        $enrolled_ids = EnrollmentOsce::where('id_osce', $id_osce)
            ->where('tanggal_sesi', $sesi_tanggal)
            // Jika Anda ingin memfilter berdasarkan jam juga: ->where('jam_sesi', $sesi_jam_display)
            ->pluck('id_mahasiswa');

        // 3. Query Mahasiswa
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
                'id' => $id_sesi,
                'tanggal' => $sesi_tanggal,
                'tanggal_formatted' => (new \DateTime($sesi_tanggal))->format('d M Y'),
                'jam' => $sesi_jam_display,
            ],
            'mahasiswa_list' => $mahasiswa_list
        ];
    }

    /**
     * Menghitung detail nilai mahasiswa per stase dan mengembalikan data terstruktur.
     * * @param int $id_mahasiswa
     * @param int $id_osce
     * @return array|null
     */
    public function calculateDetailNilai($id_mahasiswa, $id_osce)
    {
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->first();

        if (!$enrollment) {
            return null;
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

            // Ambil info penguji
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

        // Hitung nilai akhir per stase
        foreach ($nilaiPerStase as $key => $stase) {
            $totalSkorBobot = $stase['total_skor_bobot'] ?? 0;
            $nilaiPerStase[$key]['nilai_akhir_stase'] = $totalSkorBobot / 4; // Dibagi 4 sesuai aturan Anda
        }

        $nilai_total_osce = array_sum(array_column($nilaiPerStase, 'nilai_akhir_stase'));

        // Hitung id_sesi_kembali untuk tombol kembali
        $tgl = $enrollment->tanggal_sesi;
        $jam_raw = substr($enrollment->jam_sesi, 0, 5);
        $jam_clean = str_replace(':', '', $jam_raw);
        $id_sesi_kembali = $tgl . '_' . $jam_clean;

        return [
            'mahasiswa' => [
                'nim' => $enrollment->mahasiswa->nim,
                'nama' => $enrollment->mahasiswa->nama,
                'id_mahasiswa' => $enrollment->mahasiswa->id_mahasiswa,
            ],
            'osce' => [
                'id_osce' => $enrollment->osce->id_osce,
                'nama_osce' => $enrollment->osce->nama_osce ?? '-',
            ],
            'id_sesi_kembali' => $id_sesi_kembali,
            'nilai_per_stase' => array_values(array_map(function ($stase) {
                $stase['aspek_penilaian'] = array_values($stase['aspek_penilaian']);
                return $stase;
            }, $nilaiPerStase)),
            'nilai_total_osce' => $nilai_total_osce,
        ];
    }
}
