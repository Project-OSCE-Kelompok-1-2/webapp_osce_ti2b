<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Dedoc\Scramble\Scramble;
use Illuminate\Http\Request;

class NilaiMahasiswaController extends Controller
{
    public function showNilai()
    {
        return Inertia::render("Mahasiswa/NilaiShow");
    }
}