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
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce']) // Load OSCE juga untuk judul jika perlu
            ->findOrFail($id_enrollment_osce);

        // --- VALIDASI AKSES  ---
        $penguji = Auth::user(); 
        $penguji = $user->penguji;
        
        // Pastikan user punya profil penguji
        if (!$user->penguji) {
            abort(403, 'Akun tidak valid.');
        }

        $isAuthorized = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke penilaian ini.');
        }

        // 3. Cari satu sampel nilai untuk menentukan Stase mana yang dinilai
        // Kita load nested relation sampai ke aspek penilaian untuk dapat ID Stase
        $sampleNilai = NilaiOsce::with('poinAspekPenilaian.aspekPenilaian')
            ->where('id_enrollment_osce', $id_enrollment_osce)
            ->first();

        if (!$sampleNilai) {
            abort(404, 'Data nilai belum ditemukan (Mahasiswa belum dinilai).');
        }

        $idStase = $sampleNilai->poinAspekPenilaian->aspekPenilaian->id_stase;

        // 4. Ambil Struktur Rubrik (Aspek & Kompetensi)
        $aspekList = AspekPenilaian::with('poinAspekPenilaian')
            ->where('id_stase', $idStase)
            ->get();

        // 5. Ambil SEMUA Nilai untuk enrollment ini
        $nilaiTersimpan = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->keyBy('id_poin_aspek_penilaian'); // Key array pakai ID agar akses cepat

        $totalNilaiAspek = 0;

        // 6. Mapping Data (Gabungkan Struktur Rubrik + Nilai)
        $rubrikTerisi = $aspekList->map(function ($aspek) use ($nilaiTersimpan, &$totalNilaiAspek) {
            
            $kompetensiTerisi = $aspek->poinAspekPenilaian->map(function ($poin) use ($nilaiTersimpan, &$totalNilaiAspek) {
                
                $nilaiEntry = $nilaiTersimpan->get($poin->id_poin_aspek_penilaian);
                
                // Pastikan skor angka (int/float)
                $skor = $nilaiEntry ? (float) $nilaiEntry->nilai : 0;
                $bobot = (float) $poin->bobot;
                $nilaiKompetensi = $skor * $bobot;

                $totalNilaiAspek += $nilaiKompetensi;

                return [
                    'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                    'deskripsi'        => $poin->kompetensi,
                    'skor'             => $skor,             // Raw score (skala penguji)
                    'bobot'            => $bobot,
                    'nilai_kompetensi' => $nilaiKompetensi,  // Score * Bobot
                ];
            });

            return [
                'aspek' => $aspek->aspek, // Nama Aspek (Judul Kategori)
                'kompetensi' => $kompetensiTerisi,
            ];
        });

        return Inertia::render('Penguji/ViewNilaiDetail', [
            'mahasiswa' => [
                'nama'    => $enrollment->mahasiswa->nama,
                'nim'     => $enrollment->mahasiswa->nim,
                // Gunakan null coalescing operator (??) jika relasi prodi belum tentu ada
                'jurusan' => $enrollment->mahasiswa->prodi ?? '-', 
            ],
            'rubrik_terisi'     => $rubrikTerisi,
            'total_nilai_aspek' => $totalNilaiAspek,
            'feedback'          => $enrollment->catatan ?? '',
        ]);
    }
}