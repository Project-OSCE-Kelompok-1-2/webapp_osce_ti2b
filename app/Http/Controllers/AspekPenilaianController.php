<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\Stase;

class AspekPenilaianController extends Controller
{
    // mengambil aspek penilaian menggunakan id stase
    public function get_aspek_penilaian($id)
    {
        $stase = Stase::findOrFail($id);

        $aspek_penilaian = AspekPenilaian::where("id_stase", $id)
            ->withCount("poinAspekPenilaian as jumlah_kompetensi")
            ->get();

        $data = [
            "nama_stase" => $stase->nama_stase,
            "aspek_penilaian" => $aspek_penilaian,
        ];

        return Inertia::render("Admin/AspekPenilaian", [
            "data" => $data,
        ]);
    }
}
