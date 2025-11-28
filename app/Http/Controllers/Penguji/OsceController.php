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

        $search = $request->input('search');
        $tahun  = $request->input('tahun');

        // Query Dasar
        $query = OsceStase::with(['osce.enrollmentOsce', 'osce.tahunAkademik'])
            ->where('id_penguji', $penguji->id_penguji);

        // Filter Search
        if ($search) {
            $query->whereHas('osce', function ($q) use ($search) {
                $q->where('nama_osce', 'like', "%{$search}%");
            });
        }

        // Filter Tahun
        if ($tahun) {
            $query->whereHas('osce.tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', 'like', "%{$tahun}%");
            });
        }

        // Pagination & Sorting
        $assignments = $query->orderBy('tanggal', 'desc')->paginate(10)->withQueryString();

        // Transformasi Data untuk Frontend
        // Kita gunakan through() untuk memodifikasi item dalam paginator tanpa merusak struktur pagination
        $osceList = $assignments->through(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now();

            // Logika Status
            $status = 'Selesai';
            if ($now->lt($osce->tanggal_mulai)) {
                $status = 'Belum Dimulai';
            } elseif ($now->between($osce->tanggal_mulai, $osce->tanggal_selesai)) {
                $status = 'Aktif'; // Sesuai case di switch case frontend
            } else {
                // Jika lewat tanggal selesai, bisa jadi 'Tidak Aktif' atau 'Selesai'
                // Asumsi sederhana:
                $status = 'Selesai'; 
            }

            return [
                'id_osce'          => $osce->id_osce,
                'id_osce_stase'    => $stase->id_osce_stase,
                'nama'             => $osce->nama_osce, // Key sesuai Frontend
                'tanggal_mulai'    => $osce->tanggal_mulai->format('d F Y'),
                'tanggal_akhir'    => $osce->tanggal_selesai->format('d F Y'),
                'status'           => $status,
                'jumlah_mahasiswa' => $osce->enrollmentOsce->count(),
                'sesi'             => substr($stase->jam_mulai, 0, 5) . ' - ' . substr($stase->jam_selesai, 0, 5),
            ];
        });

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $osceList, // Ini objek Paginator (data, links, meta)
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}