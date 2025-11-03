<?php

namespace App\Http\Controllers;

use App\Models\AspekPenilaian;
use App\Models\Stase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AspekPenilaianController extends Controller
{
    // GET: semua aspek untuk satu stase
    public function index($id_stase)
    {
        $stase = Stase::with('aspekPenilaian')->findOrFail($id_stase);

        return Inertia::render('Admin/AspekPenilaian/Index', [
            'stase' => $stase,
            'aspekPenilaians' => $stase->aspekPenilaian,
        ]);
    }

    // GET: form tambah/edit aspek
    public function form($id_stase, $id_aspek = null)
    {
        $aspek = $id_aspek ? AspekPenilaian::findOrFail($id_aspek) : null;

        return Inertia::render('Admin/AspekPenilaian/Form', [
            'stase_id' => $id_stase,
            'aspek' => $aspek,
        ]);
    }

    // POST: tambah aspek baru
    public function store(Request $request, $id_stase)
    {
        $validated = $request->validate([
            'aspek' => 'required|string|max:255',
            'bobot_maksimum' => 'required|numeric|min:0',
        ]);

        AspekPenilaian::create([
            'id_stase' => $id_stase,
            ...$validated,
        ]);

        return redirect()->route('aspek.index', $id_stase)->with('success', 'Aspek berhasil ditambahkan');
    }

    // PUT: edit aspek
    public function update(Request $request, $id_stase, $id_aspek)
    {
        $validated = $request->validate([
            'aspek' => 'required|string|max:255',
            'bobot_maksimum' => 'required|numeric|min:0',
        ]);

        $aspek = AspekPenilaian::findOrFail($id_aspek);
        $aspek->update($validated);

        return redirect()->route('aspek.index', $id_stase)->with('success', 'Aspek berhasil diperbarui');
    }

    // DELETE: hapus aspek
    public function destroy($id_stase, $id_aspek)
    {
        AspekPenilaian::where('id_stase', $id_stase)
            ->where('id_aspek_penilaian', $id_aspek)
            ->delete();

        return redirect()->back()->with('success', 'Aspek berhasil dihapus');
    }
}
