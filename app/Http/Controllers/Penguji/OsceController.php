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

        $assignments = $query->orderBy('tanggal', 'desc')
            ->orderBy('jam_mulai', 'asc')
            ->paginate(10)
            ->withQueryString();

        $osceList = $assignments->through(function ($stase) {
            $osce = $stase->osce;

            // 1. Waktu
            $now = Carbon::now('Asia/Jakarta');
            $tgl = $stase->tanggal->format('Y-m-d');
            
            $startEvent = Carbon::parse($tgl . ' ' . $stase->jam_mulai, 'Asia/Jakarta');
            $endEvent   = Carbon::parse($tgl . ' ' . $stase->jam_selesai, 'Asia/Jakarta');
            $endOfDay   = Carbon::parse($tgl, 'Asia/Jakarta')->endOfDay();

            // --- FILTER PESERTA ---
            $staseTanggal = $stase->tanggal->toDateString();
            $staseJamMulai = substr($stase->jam_mulai, 0, 5);

            $pesertaSesi = $osce->enrollmentOsce
                ->filter(function ($enrollment) use ($staseTanggal, $staseJamMulai) {
                    $enrollmentTanggal = (string) Carbon::parse($enrollment->tanggal_sesi)->toDateString();
                    $enrollmentJam = substr((string) $enrollment->jam_sesi, 0, 5);
                    return $enrollmentTanggal === $staseTanggal && $enrollmentJam === $staseJamMulai;
                });

            $jumlahMahasiswa = $pesertaSesi->count();

            // --- HITUNG DINILAI ---
            $jumlahDinilai = $pesertaSesi->filter(function ($mhs) {
                return $mhs->nilaiOsce !== null;
            })->count();

            // --- 3. LOGIKA STATUS ---
            $status = 'Aktif'; 

            if ($now->greaterThan($endOfDay)) {
                $status = 'Selesai';
            }
            elseif ($jumlahMahasiswa > 0 && $jumlahMahasiswa === $jumlahDinilai) {
                $status = 'Telah Dinilai';
            }
            elseif ($now->lessThan($startEvent)) {
                $status = 'Belum Dimulai';
            }
            else {
                $status = 'Aktif';
            }

            // --- 4. TENTUKAN LABEL TOMBOL & TARGET REDIRECT ---
            $tombolAction = 'Lihat'; 
            
            // [BARU] Variabel untuk menentukan target route di frontend
            // Values: 'rekap' (halaman ujian/view), 'edit' (halaman edit/submitrubrik)
            $tipeHalaman = 'rekap'; 

            if ($status === 'Aktif') {
                // Jika jam sesi sudah lewat tapi masih hari yang sama -> Mode Edit
                if ($now->greaterThan($endEvent)) {
                    $tombolAction = 'Edit Nilai';
                    $tipeHalaman  = 'edit'; // Redirect ke submitrubrik/edit
                } else {
                    $tombolAction = 'Mulai Ujian';
                    $tipeHalaman  = 'rekap'; // Redirect ke halaman ujian biasa
                }
            } 
            elseif ($status === 'Telah Dinilai') {
                $tombolAction = 'Edit Nilai';
                $tipeHalaman  = 'edit'; // Redirect ke submitrubrik/edit
            } 
            elseif ($status === 'Selesai') {
                $tombolAction = 'Lihat Rekap Nilai';
                $tipeHalaman  = 'rekap'; // Redirect ke rekap view only
            } 
            elseif ($status === 'Belum Dimulai') {
                $tombolAction = 'Mulai Ujian';
                $tipeHalaman  = 'rekap';
            }

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce,
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                
                'status'           => $status,
                'tombol_label'     => $tombolAction,
                
                // [PENTING] Gunakan ini di frontend untuk menentukan route router.get(...)
                'tipe_halaman'     => $tipeHalaman, 

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