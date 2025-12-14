<?php

namespace App\Services\Penguji;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\Penguji;

class HalamanPenilaianService
{
    /**
     * Logika mengambil data Antrian (Sama persis dengan showAntrian)
     */
    public function getAntrianData($id_osce, $id_osce_stase)
    {
        // 1. Cek keamanan Auth (Strict)
        $user = Auth::user();
        if (!$user || !$user->penguji) {
            abort(403, 'Akses ditolak. Anda bukan Penguji.');
        }
        $penguji = $user->penguji; // Ambil data model Penguji

        // 2. [SECURITY FIX] Ambil Detail OSCE & Stase DENGAN Validasi Penguji
        // Panggilan relasi ditambahkan:
        // osceStaseContext -> osce (Model OSCE)
        // osceStaseContext -> stase -> aspekPenilaian (Aspek Penilaian dari Stase)
        $osceStaseContext = OsceStase::with([
            'osce',
            'stase.aspekPenilaian', // ⭐ Memanggil relasi ke aspekPenilaian melalui stase
            'ruang'
        ])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $penguji->id_penguji)
            ->first();

        // Jika data tidak ditemukan
        if (!$osceStaseContext) {
            abort(404, 'Akses Ditolak. Anda tidak ditugaskan di stase ini.');
        }

        // Memastikan relasi aspekPenilaian ada sebelum diakses
        $tujuan_pembelajaran = $osceStaseContext->stase->tujuanPembelajaran ?? collect();

        $carbon_time = Carbon::parse($osceStaseContext->jam_mulai);
        $jam_mulai_terformat = $carbon_time->format("H:i");

        // Ambil Tanggal dan Jam Mulai tugas si Penguji
        $tanggalPenguji      = $osceStaseContext->tanggal;
        $jamMulaiPenguji     = $jam_mulai_terformat;
        $jamSelesaiPenguji = $osceStaseContext->jam_selesai;

        // 3. Detail OSCE
        $totalMahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tanggalPenguji)
            ->where('jam_sesi', $jamMulaiPenguji)
            ->count();

        $osceDetail = [
            'nama_osce'              => $osceStaseContext->osce->nama_osce,
            'nama_stase'             => $osceStaseContext->stase->nama_stase,
            'durasi_per_mahasiswa' => $osceStaseContext->durasi_per_mahasiswa,
            'total_mahasiswa'        => $totalMahasiswa,
            'nomor_stasiun'          => $osceStaseContext->ruang->nomor_ruangan ?? '-',
            'jam_mulai'              => $jamMulaiPenguji . ' WIB',
            'skenario'               => $osceStaseContext->skenario,
            // ⭐ Menambahkan Aspek Penilaian ke detail yang dikirim
            'tujuan_pembelajaran'      => $tujuan_pembelajaran
        ];

        // 4. Ambil Antrian Mahasiswa (FIX LOGIKA RANGE)
        $enrollments = EnrollmentOsce::with(['mahasiswa'])
            ->where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tanggalPenguji)
            // Logika Range Waktu
            ->whereTime('jam_sesi', '>=', $jamMulaiPenguji)
            ->whereTime('jam_sesi', '<', $jamSelesaiPenguji)
            ->whereHas('mahasiswa', function ($query) {
                $query->orderBy('nim', 'asc');
            })
            ->orderBy('jam_sesi', 'asc')
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

        return [
            'osce_detail'       => $osceDetail,
            'antrian_mahasiswa' => $antrianMahasiswa
        ];
    }

    /**
     * Logika mengambil data Penilaian (Sama persis dengan showPenilaian)
     */
    public function getPenilaianData($id_enrollment_osce)
    {
        // 1. Identifikasi Mahasiswa & OSCE
        $enrollment = EnrollmentOsce::with(['mahasiswa.pengguna', 'osce'])
            ->findOrFail($id_enrollment_osce);

        // [SAFETY CHECK]
        if (!$enrollment->tanggal_sesi || !$enrollment->jam_sesi) {
            abort(403, 'Jadwal sesi mahasiswa ini belum diatur oleh admin.');
        }

        // 2. Auth Check (Strict)
        $user = Auth::user();
        if (!$user || !$user->penguji) {
            abort(403, 'Akses ditolak. Anda bukan Penguji.');
        }
        $penguji = $user->penguji;

        // 3. Cari Stase Penguji (DENGAN VALIDASI SESI YANG KETAT)
        $osceStase = OsceStase::with(['stase'])
            ->where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            // Logika Rentang Waktu
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)
            ->first();

        if (!$osceStase) {
            abort(403, 'Akses Ditolak. Jadwal menguji Anda tidak sesuai dengan sesi mahasiswa ini.');
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

        // 7. & 8. Ambil Skor Existing & Tentukan Timer
        $savedScores = NilaiOsce::where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            ->pluck('nilai', 'id_poin_aspek_penilaian');

        $isEditMode = $savedScores->isNotEmpty();

        // UPDATE LOGIKA TIMER
        $sisaWaktuDetik = 0;

        // Ambil durasi dalam menit & detik
        $durasiMenit = $osceStase->durasi_per_mahasiswa ?? 15;
        if ($durasiMenit == 0) $durasiMenit = 15;
        $durasiDetikFull = $durasiMenit * 60; // Konversi ke detik untuk patokan max

        if ($isEditMode) {
            $sisaWaktuDetik = 0;
        } else {
            $sisaWaktuDetik = $durasiDetikFull;
        }
        // Safety Cap: Pastikan sisa waktu tidak pernah melebihi durasi asli
        // Ini mencegah glitch jika ada selisih detik/timezone
        if ($sisaWaktuDetik > $durasiDetikFull) {
            $sisaWaktuDetik = $durasiDetikFull;
        }
        
        if ($sisaWaktuDetik < 0) $sisaWaktuDetik = 0;

        // 9. Perhitungan Nilai Awal (Server Side Preview)
        $totalAkumulasi = 0;
        foreach ($savedScores as $idPoin => $skor) {
            if (isset($mapBobot[$idPoin])) {
                $bobot = $mapBobot[$idPoin];
                $totalAkumulasi += ($skor * $bobot);
            }
        }

        $skalaMaksimal = 4;
        $totalNilaiAkhir = $totalAkumulasi / $skalaMaksimal;

        $existingFeedback = $enrollment->catatan;

        // Return raw array data
        return [
            'mahasiswa'          => $dataMahasiswa,
            'info_ujian'         => $infoUjian,
            'rubrik'             => $rubrik,
            'sisa_waktu_detik'   => (int) $sisaWaktuDetik,
            'mode_edit'          => $isEditMode,
            'id_enrollment_osce' => $enrollment->id_enrollment_osce,
            'existing_feedback'  => $existingFeedback,
            'saved_scores'       => $savedScores,
            'total_nilai_server' => number_format($totalNilaiAkhir, 2),
        ];
    }
}
