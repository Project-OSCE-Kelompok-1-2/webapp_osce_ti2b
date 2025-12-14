<?php

namespace App\Http\Controllers\Mahasiswa;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Controller;
use App\Models\OsceStase;
use App\Models\NilaiOsce;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;

class DashboardMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswa;

        if (!$mahasiswa) {
            return redirect()->back()->with('error', 'Data mahasiswa tidak ditemukan.');
        }

        $idMahasiswa = $mahasiswa->id_mahasiswa;
        $today = Carbon::now();

        // ---------------------------------------------------------
        // 1. STATISTIK
        // ---------------------------------------------------------

        // A. Terdaftar: Hitung enrollment
        $ujianTerdaftar = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)->count();

        // B. Selesai: Hitung enrollment yang sudah ada entry di tabel nilai_osce
        $ujianSelesai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->has('nilaiOsce')
            ->count();

        // C. Rata-rata Nilai Akhir (FIXED - Relasi lengkap sampai stase)
        $enrollments = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('nilaiOsce')
            ->with([
                'nilaiOsce.poinAspekPenilaian.aspekPenilaian.stase' // Load relasi lengkap
            ])
            ->get();

        $kumpulanNilaiStase = [];

        foreach ($enrollments as $enrollment) {
            // Group nilai berdasarkan id_stase dari chain relasi
            $nilaiPerStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
                // Trace: nilai_osce → poin_aspek_penilaian → aspek_penilaian → stase
                return $nilai->poinAspekPenilaian
                    ?->aspekPenilaian
                    ?->id_stase ?? null;
            });

            // Hapus group dengan key null (jika ada data rusak)
            $nilaiPerStase = $nilaiPerStase->filter(function ($group, $key) {
                return $key !== null;
            });

            // Hitung nilai akhir per stase
            foreach ($nilaiPerStase as $idStase => $nilaiStase) {
                $totalSigmaStase = 0;

                foreach ($nilaiStase as $dataNilai) {
                    // 1. Ambil Skor (0-4)
                    $skor = $dataNilai->nilai ?? 0;

                    // 2. Ambil Bobot
                    $bobot = $dataNilai->poinAspekPenilaian->bobot ?? 0;

                    // 3. Kalikan Skor × Bobot
                    $totalSigmaStase += ($skor * $bobot);
                }

                // 4. Nilai Akhir Per Stase = Σ(skor × bobot) / 4
                $nilaiAkhirStase = $totalSigmaStase / 4;

                // 5. Cap maksimal 100
                $nilaiAkhirStase = min($nilaiAkhirStase, 100);

                $kumpulanNilaiStase[] = $nilaiAkhirStase;
            }
        }

        // Hitung rata-rata dari SEMUA nilai stase
        $totalNilai = count($kumpulanNilaiStase) > 0
            ? round(collect($kumpulanNilaiStase)->avg(), 2)
            : 0;


        // ---------------------------------------------------------
        // 2. JADWAL PENTING & KALENDER
        // ---------------------------------------------------------

        $enrolledOsceIds = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->pluck('id_osce');

        $baseQuery = OsceStase::with(['osce', 'ruang'])
            ->whereIn('id_osce', $enrolledOsceIds);

        // A. Data untuk Dots di Kalender
        $kalenderEvent = (clone $baseQuery)
            ->get()
            ->pluck('tanggal')
            ->map(function ($date) {
                return $date instanceof \Carbon\Carbon
                    ? $date->format('Y-m-d')
                    : \Carbon\Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->values();

        // B. Data untuk List Jadwal
        $listQuery = clone $baseQuery;

        if ($request->has('date') && $request->date) {
            $listQuery->whereDate('tanggal', $request->date);
        } else {
            $listQuery->whereDate('tanggal', '>=', $today->format('Y-m-d'));
        }

        $rawSchedules = $listQuery->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        $limit = $request->has('date') ? $rawSchedules->count() : 3;

        $jadwalPenting = $rawSchedules->take($limit)->map(function ($stase) use ($today) {
            $tanggalUjian = Carbon::parse($stase->tanggal);
            $selisihHari = $today->diffInDays($tanggalUjian, false);

            return [
                'id_osce_stase'  => $stase->id_osce_stase,
                'nama_ujian'     => $stase->nama_stase . ' (' . $stase->osce->nama_osce . ')',
                'ruangan'        => $stase->ruang ? $stase->ruang->nomor_ruangan : '-',
                'tanggal_full'   => $tanggalUjian->translatedFormat('l, d F Y'),
                'tanggal_pendek' => $tanggalUjian->format('d M'),
                'jam'            => Carbon::parse($stase->jam_mulai)->format('H:i'),
                'sisa_hari'      => (int) ceil($selisihHari),
                'tipe'           => 'Stase',
            ];
        })->values();

        // ---------------------------------------------------------
        // 3. RETURN INERTIA
        // ---------------------------------------------------------
        return Inertia::render('Mahasiswa/Dashboard', [
            'statistik' => [
                'terdaftar'   => $ujianTerdaftar,
                'selesai'     => $ujianSelesai,
                'nilai_akhir' => $totalNilai,
            ],
            'jadwal_penting' => $jadwalPenting,
            'kalender_event' => $kalenderEvent,
            'selected_date'  => $request->date,
        ]);
    }
}
