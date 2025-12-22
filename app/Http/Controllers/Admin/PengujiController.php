<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\Admin\PengujiService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
class PengujiController extends Controller
{
    protected $service;

    public function __construct(PengujiService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $dosen = Penguji::orderBy('nama', 'asc')->get();

        return Inertia::render('Admin/PengujiPage', [
            'dosen' => $dosen, 
            'filters' => [],  
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TambahPenguji', [
            'dosen' => null, 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip'),
                Rule::unique('pengguna', 'username'),
            ],
        ]);

        $penguji = $this->service->create($validated);

        if (!$penguji) {
            return Redirect::back()->with('error', 'Gagal menambahkan data penguji. Terjadi kesalahan server.');
        }

        return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil ditambahkan.');
    }

    public function edit(Penguji $dosen) 
    {
        return Inertia::render('Admin/TambahPenguji', [
            'dosen' => [
                'id_penguji' => $dosen->id_penguji,
                'nip' => $dosen->nip,
                'nama' => $dosen->nama,
            ],
        ]);
    }

    public function update(Request $request, Penguji $dosen)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip')->ignore($dosen->id_penguji, 'id_penguji'),
                Rule::unique('pengguna', 'username')->ignore($dosen->id_pengguna, 'id_pengguna'),
            ],
        ]);

        $penguji = $this->service->update($dosen, $validated);

        if (!$penguji) {
            return Redirect::back()->with('error', 'Gagal memperbarui data penguji.');
        }

        return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil diperbarui.');
    }

    public function destroy(Penguji $dosen)
    {
        $isDeleted = $this->service->delete($dosen);

        if (!$isDeleted) {
            return Redirect::back()->with('error', 'Gagal menghapus penguji. Mungkin terkait dengan data lain.');
        }

        return Redirect::back()->with('success', 'Penguji berhasil dihapus.');
    }
}
