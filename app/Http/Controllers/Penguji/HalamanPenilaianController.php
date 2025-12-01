<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

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

        // Ambil Tanggal dan Jam Mulai tugas si Penguji
        $tanggalPenguji  = $osceStaseContext->tanggal;   // format date (Y-m-d)
        $jamMulaiPenguji = $osceStaseContext->jam_mulai;
        $jamSelesaiPenguji = $osceStaseContext->jam_selesai; // format time (H:i:s atau H:i)

        // 3. Detail OSCE (Tetap sama)
        $totalMahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tanggalPenguji) // Filter total hanya utk sesi ini
            ->where('jam_sesi', $jamMulaiPenguji)
            ->count();

        $osceDetail = [
            'nama_osce'            => $osceStaseContext->osce->nama_osce,
            'nama_stase'           => $osceStaseContext->stase->nama_stase,
            'durasi_per_mahasiswa' => $osceStaseContext->durasi_per_mahasiswa,
            'total_mahasiswa'      => $totalMahasiswa,
            'nomor_stasiun'        => $osceStaseContext->ruang->nomor_ruangan ?? '-',
            'sesi_info'            => $jamMulaiPenguji . ' WIB', // Info tambahan utk UI
        ];

        // 4. Ambil Antrian Mahasiswa (FIX LOGIKA RANGE)
        $enrollments = EnrollmentOsce::with(['mahasiswa'])
            ->where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tanggalPenguji)

            // --- PERBAIKAN LOGIKA DISINI ---
            // Ambil mahasiswa yang jadwalnya >= Jam Mulai Penguji
            ->whereTime('jam_sesi', '>=', $jamMulaiPenguji)

            // DAN jadwalnya < Jam Selesai Penguji
            // (Pakai '<' bukan '<=' agar mahasiswa jam 10:00:00 TIDAK masuk ke sesi 08:00-10:00)
            ->whereTime('jam_sesi', '<', $jamSelesaiPenguji)
            // -------------------------------

            ->whereHas('mahasiswa', function ($query) {
                $query->orderBy('nim', 'asc');
            })
            // Tambahan: Urutkan antrian berdasarkan jam sesi mereka (08:00 dulu, baru 08:05, dst)
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

        return Inertia::render('Penguji/LiveAntrian', [
            'osce_detail'       => $osceDetail,
            'antrian_mahasiswa' => $antrianMahasiswa
        ]);
    }

    public function showPenilaian($id_enrollment_osce)
    {
        // 1. Identifikasi Mahasiswa & OSCE
        $enrollment = EnrollmentOsce::with(['mahasiswa.pengguna', 'osce'])
            ->findOrFail($id_enrollment_osce);

        // [SAFETY CHECK] Pastikan data sesi mahasiswa sudah ada
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
        // Logika: Cari jadwal penguji yang TANGGAL & JAM-nya SAMA dengan mahasiswa ini
        // 3. Cari Stase Penguji (DENGAN LOGIKA RANGE)
        $osceStase = OsceStase::with(['stase'])
            ->where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)

            // --- PERBAIKAN: Gunakan Rentang Waktu ---
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi) // Tugas mulai SEBELUM atau PAS giliran mhs
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi) // Tugas belum berakhir saat giliran mhs
            // ----------------------------------------

            ->first();

        // Jika tidak ditemukan, berarti penguji tidak bertugas di jam/sesi milik mahasiswa ini
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

        // 7. & 8. (DIGABUNG) Ambil Skor Existing & Tentukan Timer

        // A. Ambil Skor Dulu (PENTING: Harus sebelum hitung timer)
        $savedScores = NilaiOsce::where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            ->pluck('nilai', 'id_poin_aspek_penilaian');

        // Cek apakah mahasiswa ini sudah pernah dinilai?
        $isEditMode = $savedScores->isNotEmpty();

        // ============================================================
        // UPDATE LOGIKA TIMER (DENGAN FIX TIMEZONE WIB)
        // ============================================================

        $sisaWaktuDetik = 0;

        // KONDISI 1: Jika sedang EDIT nilai, Timer dimatikan (0)
        if ($isEditMode) {
            $sisaWaktuDetik = 0;
        }
        // KONDISI 2: Jika Belum dinilai, hitung sisa waktu
        elseif ($enrollment->tanggal_sesi && $enrollment->jam_sesi) {

            $tglString = $enrollment->tanggal_sesi instanceof \DateTime
                ? $enrollment->tanggal_sesi->format('Y-m-d')
                : $enrollment->tanggal_sesi;

            // -----------------------------------------------------------
            // [PERBAIKAN DISINI] Tambahkan parameter 'Asia/Jakarta'
            // Agar sistem tahu jam 08:00 itu WIB, bukan UTC.
            // -----------------------------------------------------------
            $jadwalMulai = Carbon::parse($tglString . ' ' . $enrollment->jam_sesi, 'Asia/Jakarta');

            // Ambil durasi (Default 15 menit)
            $durasiMenit = $osceStase->durasi_per_mahasiswa ?? 15;
            if ($durasiMenit == 0) $durasiMenit = 15;

            // Hitung Waktu Selesai
            $jadwalSelesai = $jadwalMulai->copy()->addMinutes($durasiMenit);

            // Waktu Sekarang (Juga harus Asia/Jakarta)
            $waktuSekarang = Carbon::now('Asia/Jakarta');

            // Cek apakah waktu sudah habis?
            if ($waktuSekarang->greaterThanOrEqualTo($jadwalSelesai)) {
                $sisaWaktuDetik = 0;
            } else {
                // Hitung selisih detik
                $sisaWaktuDetik = $waktuSekarang->diffInSeconds($jadwalSelesai, false);
            }
        }

        if ($sisaWaktuDetik < 0) $sisaWaktuDetik = 0;

        // 9. Perhitungan Nilai Awal (Server Side Preview)
        // Ini hanya untuk tampilan total sementara
        $totalAkumulasi = 0;
        foreach ($savedScores as $idPoin => $skor) {
            if (isset($mapBobot[$idPoin])) {
                $bobot = $mapBobot[$idPoin];
                $totalAkumulasi += ($skor * $bobot);
            }
        }
        // Asumsi pembagi rata-rata adalah jumlah aspek (bisa disesuaikan)
        $jumlahAspek = $aspekPenilaianList->count() > 0 ? $aspekPenilaianList->count() : 1;
        $totalNilaiAkhir = $totalAkumulasi / $jumlahAspek;

        $existingFeedback = $enrollment->catatan;

        return Inertia::render('Penguji/LivePenilaian', [
            'mahasiswa'           => $dataMahasiswa,
            'info_ujian'          => $infoUjian,
            'rubrik'              => $rubrik,

            // Props Timer Baru
            'sisa_waktu_detik'    => (int) $sisaWaktuDetik,
            'mode_edit'           => $isEditMode, // <-- Tambahan PENTING buat Frontend

            'id_enrollment_osce'  => $enrollment->id_enrollment_osce,
            'existing_feedback'   => $existingFeedback,
            'saved_scores'        => $savedScores, // Pastikan format array/object key-value
            'total_nilai_server'  => number_format($totalNilaiAkhir, 2),
        ]);
    }
}
