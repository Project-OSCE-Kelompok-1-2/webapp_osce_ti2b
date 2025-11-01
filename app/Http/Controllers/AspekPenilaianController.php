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
        $stase = Stase::findOrFail($id);
        // kueri parameter yang dikirim frontend untuk mencari aspek penilaian tertentu
        $keyword = $request->query('search');

        // jika ada keyword maka kirim aspek penilaian tertentu, jika tidak ada maka kirim semua aspek penilaian
        $aspek_penilaian = AspekPenilaian::where('id_stase', $id)
            ->when($keyword, function ($query, $keyword) {
                $query->where('aspek', 'like', "%{$keyword}%");
            })
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->get();

        $data = [
            "nama_stase" => $stase->nama_stase,
            "aspek_penilaian" => $aspek_penilaian,
            "search" => $keyword,
        ];

        return Inertia::render("Admin/AspekPenilaian", [
            "data" => $data,
        ]);
    }
}
