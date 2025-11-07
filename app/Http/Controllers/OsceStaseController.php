<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\OsceStase;
use Illuminate\Http\Request;

class OsceStaseController extends Controller
{
    public function index(Request $request, $id_osce)
    {
        // Ambil query parameter 'search'
        $search = $request->query('search');

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
        });

        // Kirim ke React dengan props tambahan 'filters' agar bisa diingat
        return Inertia::render("Admin/OsceStasePage", [
            'osce_stase' => $osce_stase,
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
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'skenario' => 'nullable|string',
            'durasi_per_mahasiswa' => 'required|integer|min:1',
        ]);

        // Simpan data ke database
        $osceStase = OsceStase::create([
            'id_ruang' => $validated['id_ruang'],
            'id_stase' => $validated['id_stase'],
            'id_penguji' => $validated['id_penguji'],
            'tanggal' => $validated['tanggal'],
            'jam_mulai' => $validated['jam_mulai'],
            'jam_selesai' => $validated['jam_selesai'],
            'skenario' => $validated['skenario'] ?? null,
            'durasi_per_mahasiswa' => $validated['durasi_per_mahasiswa'],
            'id_osce' => $id_osce,
        ]);

        if ($osceStase) {
            return redirect()->back()->with('success', 'Stase berhasil ditambahkan ke OSCE!');
        } else {
            return redirect()->back()->with('error', 'Stase gagal ditambahkan ke OSCE!');
        }
    }
}
