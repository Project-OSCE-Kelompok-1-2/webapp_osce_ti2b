<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Import Models
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\Penguji;

class HalamanPenilaianController extends Controller
{
    public function showAntrian($id_osce, $id_osce_stase)
    {
        // 1. Cek keamanan Auth (Strict)
        $user = Auth::user();
        if (!$user || !$user->penguji) {
            abort(403, 'Akses ditolak. Anda bukan Penguji.');
        }
        $penguji = $user->penguji; // Ambil data model Penguji

        // 2. [SECURITY FIX] Ambil Detail OSCE & Stase DENGAN Validasi Penguji
        // Kita tambahkan `where('id_penguji', ...)` agar penguji hanya bisa lihat antrian miliknya sendiri
        $osceStaseContext = OsceStase::with(['osce', 'stase', 'ruang'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $penguji->id_penguji) // <--- Validasi Hak Akses Stase
            ->first();

        // Jika data tidak ditemukan, berarti stase tidak ada ATAU bukan milik penguji ini
        if (!$osceStaseContext) {
            abort(404, 'Akses Ditolak. Anda tidak ditugaskan di stase ini.');
        }

        // 3. Hitung total mahasiswa
        $totalMahasiswa = EnrollmentOsce::where('id_osce', $id_osce)->count();

        $osceDetail = [
            'nama_osce'            => $osceStaseContext->osce->nama_osce,
            'nama_stase'           => $osceStaseContext->stase->nama_stase,
            'durasi_per_mahasiswa' => $osceStaseContext->durasi_per_mahasiswa,
            'total_mahasiswa'      => $totalMahasiswa,
            'nomor_stasiun'        => $osceStaseContext->ruang->nomor_ruangan ?? '-',
        ];

        // 4. Ambil Antrian Mahasiswa
        $enrollments = EnrollmentOsce::with(['mahasiswa'])
            ->where('id_osce', $id_osce)
            ->whereHas('mahasiswa', function ($query) {
                $query->orderBy('nim', 'asc');
            })
            ->get();

        $idStaseCurrent = $osceStaseContext->id_stase;

        $antrianMahasiswa = $enrollments->map(function ($enrollment) use ($idStaseCurrent) {
            $sudahDinilai = NilaiOsce::where('id_enrollment_osce', $enrollment->id_enrollment_osce)
                ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($idStaseCurrent) {
                    $q->where('id_stase', $idStaseCurrent);
                })
                ->exists();

            return [
                'id_mahasiswa'       => $enrollment->id_mahasiswa,
                'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                'nim'                => $enrollment->mahasiswa->nim,
                'nama'               => $enrollment->mahasiswa->nama,
                'status_penilaian'   => $sudahDinilai ? 'Sudah Dinilai' : 'Belum Dinilai',
            ];
        });

        return Inertia::render('Penguji/Antrian', [
            'osce_detail'       => $osceDetail,
            'antrian_mahasiswa' => $antrianMahasiswa
        ]);
    }

    public function showPenilaian($id_enrollment_osce)
    {
        // 1. Identifikasi Mahasiswa & OSCE
        $enrollment = EnrollmentOsce::with(['mahasiswa.pengguna', 'osce'])
            ->findOrFail($id_enrollment_osce);

        // 2. Auth Check (Strict)
        $user = Auth::user();
        if (!$user || !$user->penguji) {
            abort(403, 'Akses ditolak. Anda bukan Penguji.');
        }
        $penguji = $user->penguji;

        // 3. Cari Stase Penguji (Validasi Hak Akses Stase)
        $osceStase = OsceStase::with(['stase'])
            ->where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $penguji->id_penguji) // <--- Validasi Hak Akses Stase
            ->first();

        if (!$osceStase) {
            abort(404, 'Anda tidak ditugaskan di stase manapun untuk OSCE ini.');
        }

        // 4. Ambil Rubrik
        $aspekPenilaianList = AspekPenilaian::with(['poinAspekPenilaian'])
            ->where('id_stase', $osceStase->id_stase)
            ->get();

        // 5. Data Mahasiswa
        $dataMahasiswa = [
            'nama'     => $enrollment->mahasiswa->nama,
            'nim'      => $enrollment->mahasiswa->nim,
            'prodi'    => $enrollment->mahasiswa->prodi,
            'foto_url' => $enrollment->mahasiswa->pengguna->path_gambar
                ? asset('storage/' . $enrollment->mahasiswa->pengguna->path_gambar)
                : 'https://ui-avatars.com/api/?name=' . urlencode($enrollment->mahasiswa->nama),
        ];

        $infoUjian = [
            'nama_osce'  => $enrollment->osce->nama_osce,
            'nama_stase' => $osceStase->stase->nama_stase ?? 'Stase Tanpa Nama',
        ];

        // 6. Props Rubrik & Persiapan Map Bobot
        $mapBobot = [];

        $rubrik = $aspekPenilaianList->map(function ($aspek) use (&$mapBobot) {
            return [
                'aspek'      => $aspek->aspek,
                'kompetensi' => $aspek->poinAspekPenilaian->map(function ($poin) use (&$mapBobot) {
                    $mapBobot[$poin->id_poin_aspek_penilaian] = $poin->bobot;

                    return [
                        'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                        'deskripsi'               => $poin->kompetensi,
                        'bobot'                   => $poin->bobot,
                    ];
                }),
            ];
        });

        // 7. Sisa Waktu & Feedback
        $sisaWaktuDetik = ($osceStase->durasi_per_mahasiswa ?? 0) * 60;
        $existingFeedback = $enrollment->catatan;

        // 8. Ambil Skor Existing
        $savedScores = NilaiOsce::where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            ->pluck('nilai', 'id_poin_aspek_penilaian');

        // 9. Perhitungan Nilai Awal (Server Side)
        $totalAkumulasi = 0;
        foreach ($savedScores as $idPoin => $skor) {
            if (isset($mapBobot[$idPoin])) {
                $bobot = $mapBobot[$idPoin];
                $totalAkumulasi += ($skor * $bobot);
            }
        }
        $totalNilaiAkhir = $totalAkumulasi / 4;

        return Inertia::render('Penguji/Penilaian', [
            'mahasiswa'           => $dataMahasiswa,
            'info_ujian'          => $infoUjian,
            'rubrik'              => $rubrik,
            'sisa_waktu_detik'    => $sisaWaktuDetik,
            'id_enrollment_osce'  => $enrollment->id_enrollment_osce,
            'existing_feedback'   => $existingFeedback,
            'saved_scores'        => $savedScores,
            'total_nilai_server'  => number_format($totalNilaiAkhir, 2),
            'calculation_summary' => [
                'total_akumulasi' => $totalAkumulasi,
                'total_nilai'     => $totalNilaiAkhir,
                'formula_pembagi' => 4
            ]
        ]);
    }
}
