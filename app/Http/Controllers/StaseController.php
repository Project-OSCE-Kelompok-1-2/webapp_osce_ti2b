<?php

namespace App\Http\Controllers;

use App\Models\Stase;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class StaseController extends Controller
{
    public function index(Request $request)
    {
        $stase = Stase::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_stase', 'like', "%{$search}%");
            })
            ->withCount('aspekPenilaian')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/MenuStase', [
            'stase' => $stase,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // [UBAH] Ambil semua data yang diperlukan untuk dropdown
        return Inertia::render('Admin/TambahStase', [
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all(), // <-- [BARU]
        ]);
    }

    public function store(Request $request)
    {
        // [UBAH] Tambahkan validasi untuk field baru
        $request->validate([
            'nama_stase' => 'required|string|max:255|unique:stase,nama_stase',
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran', // <-- [BARU]
            'deskripsi' => 'nullable|string', // <-- [BARU]
        ]);

        Stase::create($request->all());

        return Redirect::route('admin.stase.index')->with('success', 'Stase berhasil ditambahkan.');
    }

    public function edit(Stase $stase)
    {
        // Kirim semua data yang diperlukan untuk form
        return Inertia::render('Admin/TambahStase', [
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all(),
            'stase' => $stase, // Kirim data stase yang akan diedit
        ]);
    }

    public function update(Request $request, Stase $stase)
    {
        $request->validate([
            // [UBAH] Aturan unique diubah agar mengabaikan data stase saat ini
            'nama_stase' => [
                'required',
                'string',
                'max:255',
                Rule::unique('stase', 'nama_stase')->ignore($stase->id_stase, 'id_stase'),
            ],
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran',
            'deskripsi' => 'nullable|string',
        ]);

        $stase->update($request->all());

        return Redirect::route('admin.stase.index')->with('success', 'Stase berhasil diperbarui.');
    }

    public function destroy(Stase $stase)
    {
        $stase->delete();
        return Redirect::back()->with('success', 'Stase berhasil dihapus.');
    }
    
    // Anda bisa tambahkan fungsi edit() dan update() jika diperlukan nanti
}