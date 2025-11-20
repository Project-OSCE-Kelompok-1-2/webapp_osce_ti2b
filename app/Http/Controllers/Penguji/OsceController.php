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
        $penguji = Penguji::where('id_pengguna', $user->id)->firstOrFail();

        $search = $request->input('search');
        $tahun  = $request->input('tahun');

        // Query Dasar: Ambil OsceStase milik penguji
        $query = OsceStase::with(['osce', 'osce.tahunAkademik'])
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

        // Eksekusi Query
        $assignments = $query->get();

        // Grouping & Mapping
        // Kita ambil Unique OSCE saja. Jika penguji punya 2 stase di 1 OSCE,
        // kita ambil yang pertama sebagai perwakilan link.
        $osceList = $assignments->unique('id_osce')->map(function ($stase) {
            $osce = $stase->osce;
            $now = Carbon::now();

            // Logika Status
            $status = 'Selesai';
            if ($now->lt($osce->tanggal_mulai)) {
                $status = 'Mendatang';
            } elseif ($now->between($osce->tanggal_mulai, $osce->tanggal_selesai)) {
                $status = 'Sedang Berlangsung'; // atau 'Penilaian Aktif'
            }

            return [
                'id_osce'       => $osce->id_osce,
                'id_osce_stase' => $stase->id_osce_stase, // ID ini dipakai untuk link ke detail
                'nama_osce'     => $osce->nama_osce,
                'tanggal_mulai' => $osce->tanggal_mulai, // Sudah dicasting datetime di model
                'tanggal_akhir' => $osce->tanggal_selesai,
                'status'        => $status,
            ];
        })->values(); // Reset array keys

        return Inertia::render('Penguji/PengujiOsceList', [
            'osce_list' => $osceList,
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}