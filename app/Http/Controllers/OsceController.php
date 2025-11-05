<?php

namespace App\Http\Controllers;

use App\Models\Osce;
use Illuminate\Http\Request;

class OsceController extends Controller
{
    /**
     * GET /admin/osce
     * Menampilkan daftar OSCE dengan filter search & tahun.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun');

        // Query OSCE dengan eager loading ke tahunAkademik
        $query = Osce::with('tahunAkademik');

        // Filter berdasarkan nama OSCE
        if (!empty($search)) {
            $query->where('nama_osce', 'like', "%{$search}%");
        }

        // Filter berdasarkan tahun akademik
        if (!empty($tahun)) {
            $query->whereHas('tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', 'like', "%{$tahun}%");
            });
        }

        // Urutkan berdasarkan tanggal_mulai terbaru
        $osceList = $query->orderBy('tanggal_mulai', 'desc')->get();

        // Kembalikan response JSON
        return response()->json([
            'status' => true,
            'message' => 'Daftar OSCE berhasil diambil.',
            'data' => $osceList,
        ]);
    }

    /**
     * POST /admin/osce
     * Membuat data OSCE baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'nama_osce' => 'required|string|max:255',
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        // Simpan data OSCE
        $osce = Osce::create($validated);

        // Tambahkan eager loading untuk tahun akademik
        $osce->load('tahunAkademik');

        return response()->json([
            'status' => true,
            'message' => 'Data OSCE berhasil dibuat.',
            'data' => $osce,
        ], 201);
    }
}
