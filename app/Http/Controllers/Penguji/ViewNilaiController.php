<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\OsceStase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ViewNilaiController extends Controller
{
    // [TAMBAHKAN Request $request DISINI]
    public function __invoke(Request $request, $id_enrollment_osce)
    {
        // 1. Ambil Data Enrollment & Mahasiswa
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->findOrFail($id_enrollment_osce);

        $pengguna = Auth::user();

        // Pastikan pengguna punya profil penguji

        if (!$pengguna->penguji) {
            abort(403, 'Akun tidak valid: Anda bukan penguji.');
        }

        // --- [PERBAIKAN LOGIKA PENGAMBILAN STASE] ---

        // Ambil parameter 'return_stase' dari URL (dikirim dari frontend)
        $targetOsceStaseId = $request->query('return_stase');

        $query = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $pengguna->penguji->id_penguji);

        // JIKA ada parameter ID spesifik, kita cari yang itu saja (PASTI AKURAT)
        if ($targetOsceStaseId) {
            $query->where('id_osce_stase', $targetOsceStaseId);
        }

        // Ambil data (gunakan firstOrFail agar aman jika ID dipalsukan)
        $osceStase = $query->first();

        if (!$osceStase) {
            abort(403, 'Anda tidak memiliki akses ke penilaian stase ini.');
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

        // 5. Mapping Data
        $rubrikTerisi = $aspekList->map(function ($aspek) use ($nilaiTersimpan, &$totalNilaiAspek) {

            $kompetensiTerisi = $aspek->poinAspekPenilaian->map(function ($poin) use ($nilaiTersimpan, &$totalNilaiAspek) {

                $nilaiEntry = $nilaiTersimpan->get($poin->id_poin_aspek_penilaian);

                $skor = $nilaiEntry ? (float) $nilaiEntry->nilai : 0.0;
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

        return Inertia::render('Penguji/ViewNilaiDetail', [
            'mahasiswa' => [
                'nama'    => $enrollment->mahasiswa->nama,
                'nim'     => $enrollment->mahasiswa->nim,
                'jurusan' => $enrollment->mahasiswa->prodi ?? 'Prodi Tidak Tersedia',
            ],
            'rubrik_terisi'     => $rubrikTerisi,
            // rumus nilai total dibagi 4
            'total_nilai_aspek' => $totalNilaiAspek / 4,
            'feedback'          => $feedback,
            // --- [MODIFIKASI 2] KIRIM DATA NAVIGASI KE FRONTEND ---
            // Data ini sekarang PASTI BENAR karena $osceStase diambil berdasarkan ID spesifik betulan
            'info_ujian' => [
                'id_osce'       => $enrollment->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
            ],
        ]);
    }
}
