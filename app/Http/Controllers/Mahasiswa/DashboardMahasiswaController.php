<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
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

        $ujianTerdaftar = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osceStase', function ($query) use ($today) {
                $query->whereDate('tanggal', '>=', $today);
            })
            ->count();

        $ujianSelesai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereNotNull('nilai_total') // Atau status_lulus != null
            ->count();

        $rataRataNilai = EnrollmentOsce::where('id_mahasiswa', $idMahasiswa)
            ->whereNotNull('nilai_total')
            ->avg('nilai_total');

        $rawSchedules = EnrollmentOsce::with(['osceStase.osce', 'osceStase.ruang'])
            ->where('id_mahasiswa', $idMahasiswa)
            ->whereHas('osceStase', function ($query) use ($today) {
    
                $query->whereDate('tanggal', '>=', $today->format('Y-m-d'));
            })
            ->get()
            
            ->sortBy(function ($enrollment) {
                return $enrollment->osceStase->tanggal . ' ' . $enrollment->osceStase->jam_mulai;
            });

        $jadwalPenting = $rawSchedules->take(3)->map(function ($item) use ($today) {
            $stase = $item->osceStase;
            $tanggalUjian = Carbon::parse($stase->tanggal);
            $selisihHari = $tanggalUjian->diffInDays($today->startOfDay());
            
            $selisihHari = $today->diffInDays($tanggalUjian, false); 

            return [
                'id_osce'        => $stase->osce->id_osce,
                'nama_ujian'     => $stase->osce->nama_osce, // Atau nama stase: $stase->nama_stase
                'tanggal_full'   => $tanggalUjian->translatedFormat('l, d F Y'), // "Senin, 10 Oktober 2025"
                'tanggal_pendek' => $tanggalUjian->format('d M Y'), // "10 Okt 2025"
                'jam'            => Carbon::parse($stase->jam_mulai)->format('H:i'),
                'sisa_hari'      => (int) ceil($selisihHari), // Pembulatan ke atas
                'is_urgent'      => $selisihHari <= 1, // True jika H-0 atau H-1
                'tipe'           => 'Ujian', // Hardcode atau logic dinamis
            ];
        })->values(); // Reset array keys agar jadi JSON Array [0,1,2] bukan Object {3:.., 5:..}

        // ---------------------------------------------------------
        // 4. LOGIKA KALENDER EVENT
        // ---------------------------------------------------------
        
        // Ambil array tanggal unik dari jadwal di atas untuk dot di kalender
        $kalenderEvent = $rawSchedules->map(function ($item) {
            return $item->osceStase->tanggal; // Format Y-m-d langsung dari DB
        })->unique()->values();

        // ---------------------------------------------------------
        // 5. RETURN KE INERTIA
        // ---------------------------------------------------------

        return Inertia::render('Mahasiswa/Dashboard', [
            // 'auth' sudah dihandle Middleware Afkar
            
            'statistik' => [
                'terdaftar'   => $ujianTerdaftar,
                'selesai'     => $ujianSelesai,
                'nilai_akhir' => $rataRataNilai ? round($rataRataNilai, 2) : 0,
            ],

            'jadwal_penting' => $jadwalPenting,

            // Agenda mendatang bisa diambil dari sisa jadwal penting atau query range 7 hari
            // Disini saya samakan datanya dengan sisa jadwal penting (skip 3 pertama)
            'agenda_mendatang' => $rawSchedules->skip(3)->take(5)->map(function ($item) {
                 $stase = $item->osceStase;
                 return [
                    'id_osce'       => $stase->osce->id_osce,
                    'nama_kegiatan' => $stase->osce->nama_osce,
                    'tanggal'       => $stase->tanggal,
                    'hari_sisa'     => Carbon::parse($stase->tanggal)->diffInDays(Carbon::now(), false),
                    'tipe'          => 'Stase'
                 ];
            })->values(),

            'kalender_event' => $kalenderEvent,
        ]);
    }
}