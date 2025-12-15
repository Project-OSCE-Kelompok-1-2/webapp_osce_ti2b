<?php

namespace App\Http\Controllers\Api\v1\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\OsceStase;
use Illuminate\Support\Facades\Auth;

class ViewNilaiController extends Controller
{
    /**
     * Mendapatkan nilai per rubrik dari mahasiswa.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id_enrollment_osce
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request, $id_enrollment_osce)
    {
        // 1. Ambil Data Enrollment & Mahasiswa
        // Menggunakan find() agar bisa handle error manual jika tidak ketemu
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->find($id_enrollment_osce);

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Data enrollment tidak ditemukan.'
            ], 404);
        }

        $pengguna = Auth::user();

        // Pastikan pengguna punya profil penguji
        if (!$pengguna || !$pengguna->penguji) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak valid: Anda bukan penguji.'
            ], 403);
        }

        // --- [LOGIKA PENGAMBILAN STASE] ---

        // Ambil parameter 'return_stase' dari Query Params
        $targetOsceStaseId = $request->query('return_stase');

        $query = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $pengguna->penguji->id_penguji);

        // Filter berdasarkan ID spesifik jika ada
        if ($targetOsceStaseId) {
            $query->where('id_osce_stase', $targetOsceStaseId);
        }

        // Ambil data stase
        $osceStase = $query->first();

        if (!$osceStase) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke penilaian stase ini atau ID stase tidak valid.'
            ], 403);
        }

        $idStase = $osceStase->id_stase;

        // 3. Ambil Nilai (Jika ada)
        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian');

        // 4. Ambil Struktur Rubrik
        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        $totalNilaiAspek = 0;

        // 5. Mapping Data (Logic Kalkulasi)
        $rubrikTerisi = $aspekList->map(function ($aspek) use ($nilaiTersimpan, &$totalNilaiAspek) {

            $kompetensiTerisi = $aspek->poinAspekPenilaian->map(function ($poin) use ($nilaiTersimpan, &$totalNilaiAspek) {

                $nilaiEntry = $nilaiTersimpan->get($poin->id_poin_aspek_penilaian);

                $skor = $nilaiEntry ? (float) $nilaiEntry->nilai : 0.0;
                $bobot = (float) $poin->bobot;

                $nilaiKompetensi = $skor * $bobot;
                $totalNilaiAspek += $nilaiKompetensi;

                return [
                    'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                    'deskripsi'        => $poin->kompetensi,
                    'skor'             => $skor,
                    'bobot'            => $bobot,
                    'nilai_kompetensi' => $nilaiKompetensi,
                ];
            });

            return [
                'aspek' => $aspek->aspek,
                'kompetensi' => $kompetensiTerisi,
            ];
        });

        $feedback = $enrollment->catatan ?? '';

        // 6. Return JSON Response
        return response()->json([
            'success' => true,
            'data' => [
                'mahasiswa' => [
                    'nama'    => $enrollment->mahasiswa->nama,
                    'nim'     => $enrollment->mahasiswa->nim,
                    'jurusan' => $enrollment->mahasiswa->prodi ?? 'Prodi Tidak Tersedia',
                ],
                'rubrik_terisi'     => $rubrikTerisi,
                // Rumus nilai total dibagi 4 sesuai logika controller asli
                'total_nilai_aspek' => $totalNilaiAspek / 4,
                'feedback'          => $feedback,
                'info_ujian' => [
                    'id_osce'       => $enrollment->id_osce,
                    'id_osce_stase' => $osceStase->id_osce_stase,
                ],
            ]
        ], 200);
    }
}
