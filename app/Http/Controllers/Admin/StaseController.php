<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Stase;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use App\Services\Admin\StaseService;
use Illuminate\Validation\Rule;
use App\Models\TujuanPembelajaran;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class StaseController extends Controller
{
    protected $service;

    public function __construct(StaseService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $search = $request->query("search");
        $stase = $this->service->getAll($search);

        return Inertia::render('Admin/MenuStase', [
            'stase' => $stase['data'],
            'filters' => $request->only(['search']),
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all()
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
        $validated = $request->validate([
            'nama_stase' => 'required|string|max:255|unique:stase,nama_stase',
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'deskripsi' => 'nullable|string',
            // UBAH DISINI: Menerima array string
            'tujuan_pembelajaran' => 'required|array|min:1|max:5',
            'tujuan_pembelajaran.*' => 'string',
        ]);

        $this->service->store($validated);
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
        $validated = $request->validate([
            'nama_stase' => [
                'required',
                'string',
                'max:255',
                Rule::unique('stase', 'nama_stase')->ignore($stase->id_stase, 'id_stase'),
            ],
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'deskripsi' => 'nullable|string',
            // UBAH DISINI: Menerima array string
            'tujuan_pembelajaran' => 'required|array|min:1|max:5',
            'tujuan_pembelajaran.*' => 'string',
        ]);

        $this->service->update($validated, $stase->id_stase);
        return Redirect::route('admin.stase.index')->with('success', 'Stase berhasil diperbarui.');
    }

    public function destroy(Stase $stase)
    {
        $this->service->delete($stase->id_stase);
        return Redirect::back()->with('success', 'Stase berhasil dihapus.');
    }

    // Anda bisa tambahkan fungsi edit() dan update() jika diperlukan nanti
}
