<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\OsceStase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ViewNilaiController extends Controller
{
    public function __invoke($id_enrollment_osce)
    {
        // 1. Ambil Data Enrollment & Mahasiswa
        // HAPUS '.prodi' karena Mahasiswa Model tidak punya relasi prodi
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->findOrFail($id_enrollment_osce);

        // --- PERBAIKAN BUG: Gunakan $pengguna secara konsisten ---
        $pengguna = Auth::user(); 
        
        // Pastikan pengguna punya profil penguji
        if (!$pengguna->penguji) {
            abort(403, 'Akun tidak valid: Anda bukan penguji.');
        }

        // --- VALIDASI AKSES ---
        $isAuthorized = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $pengguna->penguji->id_penguji)
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke penilaian ini.');
        }

        // 3. Cari satu sampel nilai untuk menentukan Stase mana yang dinilai
        $sampleNilai = NilaiOsce::with('poinAspekPenilaian.aspekPenilaian')
            ->where('id_enrollment_osce', $id_enrollment_osce)
            ->first();

        if (!$sampleNilai) {
            abort(404, 'Data nilai belum ditemukan (Mahasiswa belum dinilai oleh penguji stase ini).');
        }

        $idStase = $sampleNilai->poinAspekPenilaian->aspekPenilaian->id_stase;

        // 4. Ambil Struktur Rubrik (Aspek & Kompetensi)
        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        // 5. Ambil SEMUA Nilai untuk enrollment ini
        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian');

        $totalNilaiAspek = 0;

        // 6. Mapping Data (Gabungkan Struktur Rubrik + Nilai)
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

        // Catatan: Asumsi kolom 'catatan' ada di tabel EnrollmentOsce
        $feedback = $enrollment->catatan ?? '';

        return Inertia::render('Penguji/ViewNilaiDetail', [
            'mahasiswa' => [
                'nama'    => $enrollment->mahasiswa->nama,
                'nim'     => $enrollment->mahasiswa->nim,
                // PERBAIKAN: Akses kolom 'prodi' (string) langsung dari Model Mahasiswa
                'jurusan' => $enrollment->mahasiswa->prodi ?? 'Prodi Tidak Tersedia', 
            ],
            'rubrik_terisi'     => $rubrikTerisi,
            'total_nilai_aspek' => $totalNilaiAspek,
            'feedback'          => $feedback,
        ]);
    }
}