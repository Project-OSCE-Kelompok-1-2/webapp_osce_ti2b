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
use Illuminate\Pagination\LengthAwarePaginator; // Import Paginator Manual

class OsceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        $search = $request->input('search');
        $tahun  = $request->input('tahun');

        $tahunOptions = TahunAkademik::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->get();

        $query = OsceStase::with([
            'osce.enrollmentOsce.nilaiOsce',
            'osce.tahunAkademik'
        ])
            ->where('id_penguji', $penguji->id_penguji);

        if ($search) {
            $query->whereHas('osce', function ($q) use ($search) {
                $q->where('nama_osce', 'like', "%{$search}%");
            });
        }

        if ($tahun) {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', 'like', "%{$tahun}%");
            });
        }

        // 1. Ambil SEMUA data dulu (jangan paginate di SQL)
        // Kita tetap urutkan tanggal sebagai secondary sort
        $allAssignments = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // 2. Transformasi & Hitung Status
        $transformedCollection = $allAssignments->map(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now('Asia/Jakarta');
            $tgl = $stase->tanggal->format('Y-m-d');
            $startEvent = Carbon::parse($tgl . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
            $endEvent   = Carbon::parse($tgl . ' ' . $stase->jam_selesai, 'Asia/Jakarta');

            $staseTanggal = $stase->tanggal->toDateString();
            $staseJamMulai = substr($stase->jam_mulai, 0, 5);

            $pesertaSesi = $osce->enrollmentOsce
                ->filter(function ($enrollment) use ($staseTanggal, $staseJamMulai) {
                    $enrollmentTanggal = (string) Carbon::parse($enrollment->tanggal_sesi)->toDateString();
                    $enrollmentJam = substr((string) $enrollment->jam_sesi, 0, 5);
                    return $enrollmentTanggal === $staseTanggal && $enrollmentJam === $staseJamMulai;
                });

            $jumlahMahasiswa = $pesertaSesi->count();
            $jumlahDinilai = $pesertaSesi->filter(function ($mhs) {
                return $mhs->nilaiOsce !== null;
            })->count();

            // --- LOGIKA STATUS ---
            $status = 'Aktif';
            $priority = 1; // Prioritas untuk sorting (semakin kecil, semakin atas)

            // Prioritas Sorting User: Aktif (1) -> Telah Dinilai (2) -> Belum Dimulai (3) -> Selesai (4)

            if ($now->greaterThan($endEvent)) {
                $status = 'Selesai';
                $priority = 4;
            } elseif ($jumlahMahasiswa > 0 && $jumlahMahasiswa === $jumlahDinilai) {
                $status = 'Telah Dinilai'; // Asumsi user maksud "Belum Dinilai" adalah logic ini atau sebaliknya, sesuaikan jika perlu
                $priority = 2;
            } elseif ($now->lessThan($startEvent)) {
                $status = 'Belum Dimulai';
                $priority = 3;
            } else {
                $status = 'Aktif';
                $priority = 1;
            }

            // Tentukan Label Tombol
            $tombolAction = match ($status) {
                'Aktif' => 'Mulai Ujian',
                'Telah Dinilai' => 'Edit Nilai',
                'Selesai' => 'Lihat Rekap Nilai',
                'Belum Dimulai' => 'Mulai Ujian',
                default => 'Lihat'
            };

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce,
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                'status'           => $status,
                'status_priority'  => $priority, // Kolom bantuan untuk sorting
                'tombol_label'     => $tombolAction,
                'jumlah_mahasiswa' => $jumlahMahasiswa,
                'jumlah_dinilai'   => $jumlahDinilai,
                'sesi'             => substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
            ];
        });

        // 3. Sorting Collection Berdasarkan Prioritas Status
        // Jika priority sama, dia akan fallback ke urutan tanggal (karena query SQL awal sudah order by tanggal)
        $sortedCollection = $transformedCollection->sortBy('status_priority')->values();

        // 4. Pagination Manual (Karena kita mengurutkan Collection, bukan Query SQL)
        $page = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 10;
        $total = $sortedCollection->count();

        // Slice array untuk halaman saat ini
        $currentPageItems = $sortedCollection->slice(($page - 1) * $perPage, $perPage)->values();

        // Buat object Paginator baru agar format JSON sama persis dengan ->paginate() bawaan Laravel
        $paginatedItems = new LengthAwarePaginator(
            $currentPageItems,
            $total,
            $perPage,
            $page,
            [
                'path' => LengthAwarePaginator::resolveCurrentPath(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $paginatedItems, // Struktur data tetap sama, frontend aman
            'tahun_options' => $tahunOptions,
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}