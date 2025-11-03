<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Models\Stase;

class AspekPenilaianController extends Controller
{
    // Menggantikan get_aspek_penilaian
    public function index(Request $request, Stase $stase)
    {
        $aspek_penilaian = AspekPenilaian::where('id_stase', $stase->id_stase)
            ->when($request->input('search'), function ($query, $search) {
                $query->where('aspek', 'like', "%{$search}%");
            })
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->paginate(10)
            ->withQueryString();
        
        // Mengubah nama kolom agar konsisten dengan frontend sebelumnya
        $aspek_penilaian->getCollection()->transform(function ($item) {
            $item->nama = $item->aspek;
            $item->bobot = $item->bobot_maksimum;
            $item->id = $item->id_aspek_penilaian;
            return $item;
        });

        return Inertia::render('Admin/MenuAspekPenilaian', [
            'stase' => $stase,
            'aspek_penilaian' => $aspek_penilaian,
            'filters' => $request->only(['search'])
        ]);
    }
    
    public function create(Stase $stase)
    {
        return Inertia::render('Admin/TambahAspekPenilaian', [
            'stase' => $stase,
            'aspek' => null, // Kirim null untuk mode 'create'
        ]);
    }

    /**
     * Menyimpan Aspek Penilaian baru.
     */
    public function store(Request $request, Stase $stase)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);

        $stase->aspekPenilaian()->create($validated);

        return Redirect::route('admin.stase.aspek-penilaian.index', $stase->id_stase)
            ->with('success', 'Aspek Penilaian berhasil ditambahkan.');
    }
    
    /**
     * Menampilkan form untuk mengedit Aspek Penilaian.
     */
    public function edit(AspekPenilaian $aspekPenilaian)
    {
        $aspekPenilaian->load('stase'); // Load relasi untuk breadcrumb
        return Inertia::render('Admin/TambahAspekPenilaian', [
            'stase' => $aspekPenilaian->stase,
            'aspek' => $aspekPenilaian, // Kirim data aspek untuk di-edit
        ]);
    }

    /**
     * Memperbarui Aspek Penilaian.
     */
    public function update(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);
        
        $aspekPenilaian->update($validated);

        return Redirect::route('admin.stase.aspek-penilaian.index', $aspekPenilaian->id_stase)
            ->with('success', 'Aspek Penilaian berhasil diperbarui.');
    }
}
