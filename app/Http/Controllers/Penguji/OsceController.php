<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Penguji;
use App\Models\OsceStase;
use App\Models\TahunAkademik;

class OsceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        $search = $request->input('search');
        $tahun  = $request->input('tahun');

        // Ini aman, cuma select data tahun saja, tidak mengganggu query utama
        $tahunOptions = TahunAkademik::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->get();

        // Load relasi yang dibutuhkan
        $query = OsceStase::with([
            'osce.enrollmentOsce.nilaiOsce',
            'osce.tahunAkademik'
        ])
            ->where('id_penguji', $penguji->id_penguji);

        // Filter Search (Berdasarkan Nama OSCE)
        if ($search) {
            $query->whereHas('osce', function ($q) use ($search) {
                $q->where('nama_osce', 'like', "%{$search}%");
            });
        }

        // Filter Tahun Akademik
        if ($tahun) {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', 'like', "%{$tahun}%");
            });
        }

        // Pagination & Sorting
        $assignments = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_mulai', 'asc')
            ->paginate(10)
            ->withQueryString();

        // Transformasi Data
        $osceList = $assignments->through(function ($stase) {
            $osce = $stase->osce;

            // [PERBAIKAN 1] Gunakan Waktu Real-time Server
            $now = Carbon::now('Asia/Jakarta');

            // [PERBAIKAN 2] Parse Jadwal dengan Timezone Jakarta
            $tgl = $stase->tanggal->format('Y-m-d');

            // Menggabungkan tanggal dengan jam mulai/selesai
            $startEvent = Carbon::parse($tgl . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
            $endEvent   = Carbon::parse($tgl . ' ' . $stase->jam_selesai, 'Asia/Jakarta');

            // --- 1. LOGIKA FILTER PESERTA ---
            $staseTanggal = $stase->tanggal->toDateString();
            $staseJamMulai = substr($stase->jam_mulai, 0, 5);

            // Filter hanya mahasiswa yang dijadwalkan di sesi ini
            $pesertaSesi = $osce->enrollmentOsce
                ->filter(function ($enrollment) use ($staseTanggal, $staseJamMulai) {
                    $enrollmentTanggal = (string) Carbon::parse($enrollment->tanggal_sesi)->toDateString();
                    $enrollmentJam = substr((string) $enrollment->jam_sesi, 0, 5);
                    return $enrollmentTanggal === $staseTanggal && $enrollmentJam === $staseJamMulai;
                });

            $jumlahMahasiswa = $pesertaSesi->count();

            // --- 2. HITUNG YANG SUDAH DINILAI ---
            $jumlahDinilai = $pesertaSesi->filter(function ($mhs) {
                return $mhs->nilaiOsce !== null;
            })->count();

            // --- 3. LOGIKA STATUS ---
            $status = 'Aktif'; // Default initialization

            // Prioritas 1: Cek apakah waktu sudah habis? (MUTLAK)
            if ($now->greaterThan($endEvent)) {
                $status = 'Selesai';
            }
            // Prioritas 2: Cek apakah semua mahasiswa sudah dinilai?
            elseif ($jumlahMahasiswa > 0 && $jumlahMahasiswa === $jumlahDinilai) {
                $status = 'Telah Dinilai';
            }
            // Prioritas 3: Cek apakah belum dimulai?
            elseif ($now->lessThan($startEvent)) {
                $status = 'Belum Dimulai';
            }
            // Prioritas 4: Sedang berlangsung
            else {
                $status = 'Aktif';
            }

            // --- 4. TENTUKAN LABEL TOMBOL ---
            $tombolAction = 'Lihat'; // Default

            if ($status === 'Aktif') {
                $tombolAction = 'Mulai Ujian';
            } elseif ($status === 'Telah Dinilai') {
                $tombolAction = 'Edit Nilai';
            } elseif ($status === 'Selesai') {
                $tombolAction = 'Lihat Rekap Nilai';
            } elseif ($status === 'Belum Dimulai') {
                $tombolAction = 'Mulai Ujian';
            }

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce,
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),

                // Data untuk Logika Frontend
                'status'           => $status,
                'tombol_label'     => $tombolAction,

                'jumlah_mahasiswa' => $jumlahMahasiswa,
                'jumlah_dinilai'   => $jumlahDinilai,
                'sesi'             => substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
            ];
        });

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $osceList,
            'tahun_options' => $tahunOptions,
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}
