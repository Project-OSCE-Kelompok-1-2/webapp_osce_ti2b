<?php

namespace App\Http\Controllers;

use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class KompetensiController extends Controller
{
    /**
     * [INI YANG PERLU DIPERBAIKI]
     * Menampilkan daftar kompetensi untuk aspek penilaian tertentu.
     */
    public function index(Request $request, AspekPenilaian $aspekPenilaian)
    {
        // Muat relasi stase agar bisa ditampilkan di breadcrumb
        $aspekPenilaian->load('stase');

        // Ambil data kompetensi dengan paginasi dan fitur pencarian
        $kompetensi = $aspekPenilaian->poinAspekPenilaian()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('kompetensi', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        // Kirim data ke komponen 'Admin/MenuKompetensi'
        return Inertia::render('Admin/MenuKompetensi', [
            'aspek' => $aspekPenilaian,
            'kompetensi' => $kompetensi,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat kompetensi baru.
     */
    public function create(AspekPenilaian $aspekPenilaian)
    {
        $aspekPenilaian->load('stase');

        return Inertia::render('Admin/TambahKompetensi', [
            'aspek' => $aspekPenilaian,
        ]);
    }

    /**
     * Menyimpan kompetensi baru ke database.
     */
    public function store(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $validated = $request->validate([
            'kompetensi' => 'required|string',
            'bobot' => 'required|integer|min:1|max:5',
        ]);

        $aspekPenilaian->poinAspekPenilaian()->create($validated);

        return Redirect::route('admin.aspek-penilaian.kompetensi.index', $aspekPenilaian->id_aspek_penilaian)
            ->with('success', 'Kompetensi berhasil ditambahkan.');
    }

public function edit(PoinAspekPenilaian $kompetensi)
    {
        // Muat relasi
        $kompetensi->load('aspekPenilaian.stase');

        // Render component 'Tambah' (sesuai pola Anda)
        return Inertia::render('Admin/TambahKompetensi', [
            'aspek' => $kompetensi->aspekPenilaian,
            'kompetensi' => $kompetensi, // Kirim data yang akan diedit
        ]);
    }

    /**
     * Memperbarui kompetensi di database.
     * Route: PUT /admin/kompetensi/{kompetensi}
     */
    public function update(Request $request, PoinAspekPenilaian $kompetensi)
    {
        $validated = $request->validate([
            'kompetensi' => [
                'required', 'string',
                Rule::unique('poin_aspek_penilaian', 'kompetensi')
                    ->ignore($kompetensi->id_poin_aspek_penilaian, 'id_poin_aspek_penilaian')
                    ->where('id_aspek_penilaian', $kompetensi->id_aspek_penilaian)
            ],
            'bobot' => 'required|integer|min:1|max:5',
        ]);

        $kompetensi->update($validated);

        return Redirect::route('admin.aspek-penilaian.kompetensi.index', $kompetensi->id_aspek_penilaian)
            ->with('success', 'Kompetensi berhasil diperbarui.');
    }

    /**
     * Menghapus data kompetensi.
     */
    public function destroy(PoinAspekPenilaian $kompetensi)
    {
        $aspekId = $kompetensi->id_aspek_penilaian;
        $kompetensi->delete();

        return Redirect::route('admin.aspek-penilaian.kompetensi.index', $aspekId)
            ->with('success', 'Kompetensi berhasil dihapus.');
    }

    // Anda bisa menambahkan method edit() dan update() di sini nanti
}