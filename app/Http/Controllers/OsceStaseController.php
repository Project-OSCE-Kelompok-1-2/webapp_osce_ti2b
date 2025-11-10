<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\OsceStase;
use App\Models\Osce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class OsceStaseController extends Controller
{
    public function index(Request $request, $id_osce)
    {
        // Ambil query parameter 'search'
        $search = $request->query('search');

        $osce = Osce::findOrFail($id_osce);

        // Query dasar
        $query = OsceStase::where("id_osce", $id_osce)
            ->with(["ruang", "penguji", "stase"]);

        // Jika ada parameter 'search', tambahkan filter
        if ($search) {
            $query->whereHas('stase', function ($q) use ($search) {
                $q->where('nama_stase', 'like', '%' . $search . '%');
            });
        }

        // Ambil hasil (boleh pakai get() atau paginate())
        $osce_stase = $query->paginate(10)->through(function ($item) {
            return [
                'id_osce_stase' => $item->id_osce_stase,
                'ruang' => [
                    'nomor_ruangan' => $item->ruang->nomor_ruangan ?? null,
                ],
                'stase' => [
                    'nama_stase' => $item->stase->nama_stase ?? null,
                ],
                'penguji' => [
                    'nama' => $item->penguji->nama ?? null,
                ],
            ];
        })->withQueryString();

        // Kirim ke React dengan props tambahan 'filters' agar bisa diingat
        return Inertia::render("Admin/OsceStasePage", [
            'stase' => $osce_stase,
            'osce' => $osce,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    public function store(Request $request, $id_osce)
    {
        // Validasi input dulu
        $validated = $request->validate([
            'id_ruang' => 'required|exists:ruang,id_ruang',
            'id_stase' => 'required|exists:stase,id_stase',
            'id_penguji' => 'required|exists:penguji,id_penguji',
        ]);

        // Simpan data ke database
        OsceStase::create([
            'id_ruang' => $validated['id_ruang'],
            'id_stase' => $validated['id_stase'],
            'id_penguji' => $validated['id_penguji'],
            'id_osce' => $id_osce,
        ]);

       return Redirect::back()->with('success', 'Stase berhasil ditambahkan ke OSCE!');
    }
}
