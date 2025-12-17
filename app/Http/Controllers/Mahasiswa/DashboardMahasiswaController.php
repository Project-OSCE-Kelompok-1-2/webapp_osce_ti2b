<?php

namespace App\Http\Controllers\Mahasiswa;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;

class DashboardMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Asumsi relasi user ke mahasiswa ada
        $mahasiswa = $user->mahasiswa;

        // Fallback jika login langsung sebagai mahasiswa atau struktur beda
        $idMahasiswa = $mahasiswa ? $mahasiswa->id_mahasiswa : $user->id;

        if (!$idMahasiswa) {
            return redirect()->back()->with('error', 'Data mahasiswa tidak ditemukan.');
        }

        $today = Carbon::now();

        // ---------------------------------------------------------
        // 1. STATISTIK
        // ---------------------------------------------------------
        $ujianTerdaftar = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)->count();

        $ujianSelesai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->has('nilaiOsce')
            ->count();

        // Hitung Rata-rata Nilai
        $enrollments = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('nilaiOsce')
            ->with(['nilaiOsce.poinAspekPenilaian.aspekPenilaian.stase'])
            ->get();

        $kumpulanNilaiStase = [];

        foreach ($enrollments as $enrollment) {
            $nilaiPerStase = $enrollment->nilaiOsce->groupBy(function ($nilai) {
                return $nilai->poinAspekPenilaian?->aspekPenilaian?->id_stase ?? null;
            })->filter(fn($group, $key) => $key !== null);

            foreach ($nilaiPerStase as $nilaiStase) {
                $totalSigmaStase = 0;
                foreach ($nilaiStase as $dataNilai) {
                    $skor = $dataNilai->nilai ?? 0;
                    $bobot = $dataNilai->poinAspekPenilaian->bobot ?? 0;
                    $totalSigmaStase += ($skor * $bobot);
                }
                $nilaiAkhirStase = min($totalSigmaStase / 4, 100);
                $kumpulanNilaiStase[] = $nilaiAkhirStase;
            }
        }

        $totalNilai = count($kumpulanNilaiStase) > 0
            ? round(collect($kumpulanNilaiStase)->avg(), 2)
            : 0;

        // ---------------------------------------------------------
        // 2. JADWAL PENTING & KALENDER
        // ---------------------------------------------------------

        $baseQuery = EnrollmentOsce::query()
            ->with('osce')
            ->where('id_mahasiswa', $idMahasiswa);

        // A. DATA UNTUK DOTS DI KALENDER
        $allSchedules = (clone $baseQuery)->get();

        $kalenderEvent = $allSchedules->map(function ($item) {
            if (!$item->osce) return null;
            // Mengambil tanggal dari tabel OSCE (atau tanggal_sesi jika ada prioritas)
            return Carbon::parse($item->osce->tanggal_mulai)->format('Y-m-d');
        })->filter()->unique()->values();


        // B. DATA UNTUK LIST KARTU JADWAL
        if ($request->has('date') && $request->date) {
            $baseQuery->whereHas('osce', function ($q) use ($request) {
                $q->whereDate('tanggal_mulai', $request->date);
            });
        } else {
            $baseQuery->whereHas('osce', function ($q) use ($today) {
                $q->whereDate('tanggal_mulai', '>=', $today->format('Y-m-d'));
            });
        }

        // Sorting
        $rawSchedules = $baseQuery->get()->sortBy(function ($item) {
            return $item->osce->tanggal_mulai ?? '9999-12-31';
        });

        if (!$request->has('date')) {
            $rawSchedules = $rawSchedules->take(3);
        }

        $jadwalPenting = $rawSchedules->map(function ($item) use ($today) {
            if (!$item->osce) return null;

            $tanggalUjian = Carbon::parse($item->osce->tanggal_mulai);

            // Logika Sisa Hari
            if ($tanggalUjian->isSameDay($today)) {
                $sisaHari = 0;
            } elseif ($tanggalUjian->isPast()) {
                $sisaHari = -1 * $today->diffInDays($tanggalUjian);
            } else {
                $sisaHari = $today->diffInDays($tanggalUjian);
            }

            // AMBIL JAM DARI ENROLLMENT (jam_sesi)
            // Jika kosong, fallback ke 08:00
            $jamSesi = $item->jam_sesi
                ? Carbon::parse($item->jam_sesi)->format('H:i')
                : '08:00';

            return [
                'id_enrollment'  => $item->id_enrollment_osce ?? $item->id,
                'nama_ujian'     => $item->osce->nama_osce,
                'tanggal_full'   => $tanggalUjian->translatedFormat('l, d F Y'),
                'tanggal_pendek' => $tanggalUjian->format('d M'),
                'jam'            => $jamSesi, // <--- SUDAH DINAMIS DARI DATABASE
                'sisa_hari'      => (int) $sisaHari,
                'tipe'           => 'OSCE',
            ];
        })->filter()->values();

        return Inertia::render('Mahasiswa/Dashboard', [
            'auth' => ['user' => $user],
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
