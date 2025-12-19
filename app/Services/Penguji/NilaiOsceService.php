<?php

namespace App\Services\Penguji;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\OsceStase;
use Exception;
use Illuminate\Support\Facades\DB;

class NilaiOsceService
{
    /**
     * Mengambil detail nilai mahasiswa berdasarkan enrollment ID dan validasi penguji
     */
    public function getDetailNilai($id_enrollment_osce, $userPenguji)
    {
        $enrollment = EnrollmentOsce::with(['mahasiswa'])
            ->find($id_enrollment_osce);

        if (!$enrollment) {
            throw new Exception('Data enrollment mahasiswa tidak ditemukan.', 404);
        }

        $penguji = $userPenguji->penguji;
        
        if (!$penguji) {
             throw new Exception('Akun Anda tidak terdaftar sebagai penguji.', 403);
        }

        $isAuthorized = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $penguji->id_penguji) 
            ->exists();

        if (!$isAuthorized) {
            throw new Exception('Anda tidak memiliki akses ke penilaian mahasiswa ini.', 403);
        }

        $sampleNilai = NilaiOsce::with('poinAspekPenilaian.aspekPenilaian')
            ->where('id_enrollment_osce', $id_enrollment_osce)
            ->first();

        if (!$sampleNilai) {
            throw new Exception('Data nilai belum ditemukan untuk mahasiswa ini.', 404);
        }

        $idStase = $sampleNilai->poinAspekPenilaian->aspekPenilaian->id_stase;

        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian');

        $totalNilaiAspek = 0;

        $rubrikTerisi = $aspekList->map(function ($aspek) use ($nilaiTersimpan, &$totalNilaiAspek) {
            
            $kompetensiTerisi = $aspek->poinAspekPenilaian->map(function ($poin) use ($nilaiTersimpan, &$totalNilaiAspek) {
                
                $nilaiEntry = $nilaiTersimpan->get($poin->id_poin_aspek_penilaian);
                
                $skor = $nilaiEntry ? $nilaiEntry->nilai : 0;
                $bobot = $poin->bobot;
                $nilaiKompetensi = $skor * $bobot;

                $totalNilaiAspek += $nilaiKompetensi;

                return [
                    'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                    'deskripsi'         => $poin->kompetensi,
                    'skor'              => $skor,
                    'bobot'             => $bobot,
                    'nilai_kompetensi'  => $nilaiKompetensi,
                ];
            });

            return [
                'aspek' => $aspek->aspek,
                'kompetensi' => $kompetensiTerisi,
            ];
        });

        return [
            'mahasiswa' => [
                'nama'    => $enrollment->mahasiswa->nama,
                'nim'     => $enrollment->mahasiswa->nim,
                'jurusan' => $enrollment->mahasiswa->prodi ?? '-', 
            ],
            'rubrik_terisi'     => $rubrikTerisi,
            'total_nilai_aspek' => $totalNilaiAspek,
            'feedback'          => $enrollment->catatan,
        ];
    }

    public function storeNilai(array $data, $userPenguji)
    {
        $penguji = $userPenguji->penguji;
        if (!$penguji) {
            throw new Exception('Akun Anda tidak terdaftar sebagai penguji.', 403);
        }

        return DB::transaction(function () use ($data) { 
            
            $enrollment = EnrollmentOsce::find($data['id_enrollment_osce']);
            if (!$enrollment) {
                throw new Exception('Data enrollment tidak ditemukan.', 404);
            }

            $poinAspekId = 1; 

            $nilaiBaru = NilaiOsce::updateOrCreate(
                [
                    'id_enrollment_osce'      => $data['id_enrollment_osce'],
                    'id_poin_aspek_penilaian' => $poinAspekId, 
                ],
                [
                    'nilai' => $data['nilai'],
                ]
            );

            if (isset($data['feedback'])) {
                $enrollment->catatan = $data['feedback'];
                $enrollment->save();
            }

            return $nilaiBaru;
        });
    }
}