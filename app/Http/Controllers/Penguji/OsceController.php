<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Penguji;
use App\Models\OsceStase;

class OsceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $penguji = Penguji::where('id_pengguna', $user->id_pengguna)->firstOrFail();

        // [PERUBAHAN] Ambil SEMUA data tanpa filter search/tahun di DB
        // Eager load relasi yang dibutuhkan
        $assignments = OsceStase::with(['osce.enrollmentOsce', 'osce.tahunAkademik'])
            ->where('id_penguji', $penguji->id_penguji)
            ->orderBy('tanggal', 'desc')
            ->get(); // Gunakan GET(), bukan paginate()

        // Transformasi Data
        $osceList = $assignments->map(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now();

            $startEvent = Carbon::parse($osce->tanggal_mulai)->startOfDay();
            $endEvent   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

            // Logika Status
            $status = 'Selesai';
            if ($now->lt($startEvent)) {
                $status = 'Belum Dimulai';
            } elseif ($now->between($startEvent, $endEvent)) {
                $status = 'Aktif'; 
            } else {
                $status = 'Selesai'; 
            }
            
            // Format Tahun Akademik untuk filtering di frontend
            $tahunAkademik = $osce->tahunAkademik->tahun ?? '';

            $staseTanggal = $stase->tanggal->toDateString();
            $staseJamMulai = substr($stase->jam_mulai, 0, 5);
            
            $jumlahMahasiswaSesi = $osce->enrollmentOsce
                ->filter(function ($enrollment) use ($staseTanggal, $staseJamMulai) {
                    
                    $enrollmentTanggal = (string) Carbon::parse($enrollment->tanggal_sesi)->toDateString();                    
                    $enrollmentJam = substr((string) $enrollment->jam_sesi, 0, 5); 
                    return $enrollmentTanggal === $staseTanggal && $enrollmentJam === $staseJamMulai;
                })
                ->count();

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce, 
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                'status'           => $status,
                'jumlah_mahasiswa' => $jumlahMahasiswaSesi,
                'sesi'             => substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
                'tahun_akademik'   => $tahunAkademik, // Tambahkan field ini
            ];
        });

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $osceList, // Mengirim Array Full
            'filters'   => [],        // Filter kosong
        ]);
    }
}