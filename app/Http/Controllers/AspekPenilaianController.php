<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;

class AspekPenilaianController extends Controller
{
    // mengambil aspek penilaian dari id stase
    public function get_aspek_penilaian($id)
    {
        $id_stase = $id;
        $aspek_penilaian = AspekPenilaian::where("id_stase", $id_stase)->withCount("poinAspekPenilaian as jumlah_kompetensi")->get();

        return Inertia::render("Admin/AspekPenilaian", ["datas" => $aspek_penilaian]);
    }
}
