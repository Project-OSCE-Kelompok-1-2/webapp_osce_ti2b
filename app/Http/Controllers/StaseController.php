<?php

namespace App\Http\Controllers;

use App\Models\Stase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaseController extends Controller
{
    public function get_all_stase(Request $request)
    {
        // Ambil kata kunci pencarian dari input (misal "nobis")
        $search = $request->input('search');
        // Query dasar  
        $query = Stase::query()
            ->withCount('aspekPenilaian as jumlah_kompetensi');

        // Jika ada pencarian, tambahkan filter WHERE
        if (!empty($search)) {
            $query->where('nama_stase', 'like', '%' . $search . '%');
        }

        // Ambil hasil query
        $stases = $query->get();


        // Format hasil untuk dikirim ke Inertia
        $formattedStases = $stases->map(function ($stase) {
            return [
                'id' => $stase->id_stase,
                'nama' => $stase->nama_stase,
                'jumlah_aspek' => $stase->jumlah_kompetensi,
            ];
        });

        // Render halaman Inertia
        return Inertia::render('Stase', [
            'data' => $formattedStases,
            'search' => $search, // kirim balik ke frontend agar bisa mempertahankan nilai input
        ]);
    }
}
