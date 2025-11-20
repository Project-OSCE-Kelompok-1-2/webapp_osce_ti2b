<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\OsceStase;       // <-- Tambahan Import
use Illuminate\Support\Facades\Auth; // <-- Tambahan Import
use Inertia\Inertia;

class ViewNilaiController extends Controller
{
    /**
     * Tugas Afkar: Menampilkan Detail Nilai (Read-Only)
     * Endpoint: GET /.../penilaian/{id_enrollment_osce}/view
     */
    public function __invoke($id_enrollment_osce)
    {
        // 1. Ambil Data Enrollment & Mahasiswa
        $enrollment = EnrollmentOsce::with(['mahasiswa'])
            ->findOrFail($id_enrollment_osce);

        // --- VALIDASI AKSES (PERBAIKAN) ---
        $penguji = Auth::user(); 
        
        $isAuthorized = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $penguji->id_penguji) 
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke penilaian mahasiswa ini.');
        }
        // ----------------------------------

        // 2. Cari tahu ini Stase apa?
        $sampleNilai = NilaiOsce::with('poinAspekPenilaian.aspekPenilaian')
            ->where('id_enrollment_osce', $id_enrollment_osce)
            ->first();

        // Validasi: Jika belum ada nilai sama sekali, tidak bisa di-view
        if (!$sampleNilai) {
            abort(404, 'Data nilai belum ditemukan untuk mahasiswa ini.');
        }

        $idStase = $sampleNilai->poinAspekPenilaian->aspekPenilaian->id_stase;

        // 3. Ambil Struktur Rubrik (Aspek & Kompetensi) berdasarkan Stase yang ditemukan
        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        // 4. Ambil SEMUA Nilai/Skor yang tersimpan
        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian');

        $totalNilaiAspek = 0;

        // 5. Logic Mapping & Perhitungan
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

        // --- AMBIL FEEDBACK (PERBAIKAN) ---
        // Mengambil dari kolom 'catatan' di tabel enrollment_osce
        $feedback = $enrollment->catatan;

        return Inertia::render('Penguji/Nilai/View', [
            'mahasiswa' => [
                'nama'    => $enrollment->mahasiswa->nama,
                'nim'     => $enrollment->mahasiswa->nim,
                'jurusan' => $enrollment->mahasiswa->prodi ?? '-', 
            ],
            'rubrik_terisi'     => $rubrikTerisi,
            'total_nilai_aspek' => $totalNilaiAspek,
            'feedback'          => $feedback,
        ]);
    }
}