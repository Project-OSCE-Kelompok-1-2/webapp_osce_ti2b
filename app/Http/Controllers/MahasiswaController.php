<?php

namespace App\Http\Controllers;

//use App\Models\Mahasiswa;
//use App\Models\Pengguna;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Hash;
//use Inertia\Inertia;
use App\Imports\MahasiswaImport;
use Maatwebsite\Excel\Facades\Excel;

class MahasiswaController extends Controller
{
    /**
     * POST /admin/mahasiswa/import
     * Import data mahasiswa dari file Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        Excel::import(new MahasiswaImport, $request->file('file'));

        return redirect()->back()->with('success', 'Data mahasiswa berhasil diimport.');
    }
}
