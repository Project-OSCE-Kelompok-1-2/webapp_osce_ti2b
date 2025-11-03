<?php

namespace App\Http\Controllers;

use App\Models\Stase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaseController extends Controller
{
    // GET: daftar semua stase
    public function index()
    {
        $stases = Stase::withCount('aspekPenilaian')->get();

        return Inertia::render('Admin/Stase/Index', [
            'stases' => $stases,
        ]);
    }

    // GET: form tambah/edit
    public function form($id = null)
    {
        $stase = $id ? Stase::findOrFail($id) : null;

        return Inertia::render('Admin/Stase/Form', [
            'stase' => $stase,
        ]);
    }

    // POST: tambah stase baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_stase' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        Stase::create($validated);

        return redirect()->route('stase.index')->with('success', 'Stase berhasil ditambahkan');
    }

    // PUT: update stase
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_stase' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $stase = Stase::findOrFail($id);
        $stase->update($validated);

        return redirect()->route('stase.index')->with('success', 'Stase berhasil diperbarui');
    }

    // DELETE: hapus stase
    public function destroy($id)
    {
        $stase = Stase::findOrFail($id);
        $stase->delete();

        return redirect()->back()->with('success', 'Stase berhasil dihapus');
    }
}
