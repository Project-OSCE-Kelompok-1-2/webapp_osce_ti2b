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
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->findOrFail($id_enrollment_osce);

        $pengguna = Auth::user();
        
        // Pastikan pengguna punya profil penguji
        if (!$pengguna->penguji) {
            abort(403, 'Akun tidak valid: Anda bukan penguji.');
        }

        // 2. AMBIL DATA OSCE STASE & Validasi Akses
        $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $pengguna->penguji->id_penguji)
            ->first();

        if (!$osceStase) {
            abort(403, 'Anda tidak memiliki akses ke penilaian ini.');
        }

        // [PERBAIKAN UTAMA DISINI]
        // Kita tidak butuh sampleNilai untuk menentukan ID Stase.
        // Kita bisa ambil langsung dari $osceStase.
        $idStase = $osceStase->id_stase; 

        // 3. Ambil Nilai (Jika ada). Hapus abort(404).
        // Kita tidak perlu sampleNilai lagi untuk logika, cukup ambil semua nilai tersimpan.
        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian');

        // 4. Ambil Struktur Rubrik (Aspek & Kompetensi) berdasarkan id_stase dari OsceStase
        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        $totalNilaiAspek = 0;

        // 5. Mapping Data (Gabungkan Struktur Rubrik + Nilai)
        $rubrikTerisi = $aspekList->map(function ($aspek) use ($nilaiTersimpan, &$totalNilaiAspek) {
            
            $kompetensiTerisi = $aspek->poinAspekPenilaian->map(function ($poin) use ($nilaiTersimpan, &$totalNilaiAspek) {
                
                // Cek apakah ada nilai tersimpan untuk poin ini
                $nilaiEntry = $nilaiTersimpan->get($poin->id_poin_aspek_penilaian);
                
                // Jika nilai belum ada (null), set otomatis ke 0
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
            // Jika belum dinilai, rubrik terisi akan muncul dengan skor 0 semua
            'rubrik_terisi'     => $rubrikTerisi, 
            'total_nilai_aspek' => $totalNilaiAspek,
            'feedback'          => $feedback,
            'info_ujian' => [
                'id_osce'       => $enrollment->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
            ],
        ]);
    }
}