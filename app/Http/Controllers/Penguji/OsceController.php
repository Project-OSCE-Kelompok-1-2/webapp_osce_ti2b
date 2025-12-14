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
use Illuminate\Pagination\Paginator;
use Illuminate\Pagination\LengthAwarePaginator;

class OsceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        $search = $request->input('search');
        $tahun  = $request->input('tahun');
        $statusFilter = $request->input('status'); // 1. Tangkap Input Status

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

        $rawStase = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // Mapping (Perhitungan Status Logic)
        $mappedStase = $rawStase->map(function ($stase) {
            $osce = $stase->osce;

            // ... (CODE LOGIC WAKTU & MAHASISWA TETAP SAMA SEPERTI SEBELUMNYA) ...
            $now = Carbon::now('Asia/Jakarta');
            $tglStase   = $stase->tanggal->format('Y-m-d');
            $startEvent = Carbon::parse($tglStase . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
            $endEvent   = Carbon::parse($tglStase . ' ' . $stase->jam_selesai, 'Asia/Jakarta');
            $globalEndDate = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();

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
                 if ($mhs->nilaiOsce instanceof \Illuminate\Database\Eloquent\Collection) {
                    return $mhs->nilaiOsce->isNotEmpty();
                }
                return $mhs->nilaiOsce !== null;
            })->count();

            // ... (CODE LOGIC STATUS TETAP SAMA) ...
            $status = 'Aktif'; 
            $isFullGraded = ($jumlahMahasiswa > 0 && $jumlahMahasiswa === $jumlahDinilai);

            if ($now->greaterThan($globalEndDate)) {
                $status = 'Selesai';
            }
            elseif ($now->lessThan($startEvent)) {
                $status = 'Belum Dimulai';
            }
            else {
                if ($isFullGraded) {
                    $status = 'Telah Dinilai';
                } else {
                    if ($now->greaterThan($endEvent)) {
                        $status = 'Belum Dinilai';
                    } else {
                        $status = 'Aktif';
                    }
                }
            }

            // ... (CODE TOMBOL TETAP SAMA) ...
            $tombolAction = 'Lihat'; 
            $tipeHalaman = 'rekap'; 

            switch ($status) {
                case 'Belum Dimulai':
                    $tombolAction = 'Menunggu Jadwal';
                    $tipeHalaman  = 'rekap';
                    break;
                case 'Aktif':
                    $tombolAction = 'Mulai Ujian';
                    $tipeHalaman  = 'rekap';
                    break;
                case 'Telah Dinilai':
                    $tombolAction = 'Edit Nilai';
                    $tipeHalaman  = 'edit';
                    break;
                case 'Belum Dinilai': 
                    $tombolAction = 'Edit Nilai'; 
                    $tipeHalaman  = 'edit';
                    break;
                case 'Selesai':
                    $tombolAction = 'Lihat Rekap';
                    $tipeHalaman  = 'rekap';
                    break;
            }

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce,
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                'status'           => $status, // Ini key yang kita filter
                'tombol_label'     => $tombolAction,
                'tipe_halaman'     => $tipeHalaman, 
                'jumlah_mahasiswa' => $jumlahMahasiswa,
                'jumlah_dinilai'   => $jumlahDinilai,
                'sesi' => $stase->tanggal->translatedFormat('d M Y') . ' • ' . substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
            ];
        });

        // 2. FILTER COLLECTION BERDASARKAN STATUS (Logic Baru)
        if ($statusFilter) {
            $mappedStase = $mappedStase->where('status', $statusFilter);
        }

        // Sorting
        $statusPriority = [
            'Aktif'         => 1,
            'Belum Dinilai' => 2,
            'Telah Dinilai' => 3,
            'Belum Dimulai' => 4,
            'Selesai'       => 5,
        ];

        $sortedStase = $mappedStase->sortBy(function ($item) use ($statusPriority) {
            return $statusPriority[$item['status']] ?? 99;
        });

        // Pagination
        $currentPage = Paginator::resolveCurrentPage() ?: 1;
        $perPage = 10;
        $currentItems = $sortedStase->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginatedItems = new LengthAwarePaginator(
            $currentItems, 
            $sortedStase->count(), 
            $perPage, 
            $currentPage, 
            [
                'path' => Paginator::resolveCurrentPath(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $paginatedItems,
            'tahun_options' => $tahunOptions,
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun,
                'status' => $statusFilter // 3. Return status ke frontend
            ]
        ]);
    }
}