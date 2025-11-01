<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\Stase;

class AspekPenilaianController extends Controller
{
    // mengambil aspek penilaian menggunakan id stase
    public function get_aspek_penilaian(Request $request, $id)
    {
        // Pastikan Stase ditemukan, atau lempar 404
        $stase = Stase::findOrFail($id);

        // kueri parameter yang dikirim frontend untuk mencari aspek penilaian tertentu
        $search = $request->query('search');

        // jika ada keyword maka kirim aspek penilaian tertentu, jika tidak ada maka kirim semua aspek penilaian
        $aspek_penilaian = AspekPenilaian::where('id_stase', $id)->select("id_aspek_penilaian as id", "aspek as nama", "bobot_maksimum")
            ->when($search, function ($query, $search) {
                // Menggunakan LIKE untuk pencarian parsial
                $query->where('aspek', 'like', "%{$search}%");
            })
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->get();

        $data = [
            "nama_stase" => $stase->nama_stase,
            "aspek_penilaian" => $aspek_penilaian,
        ];

        return Inertia::render("Testing", [
            "data" => $data,
        ]);
    }
}
