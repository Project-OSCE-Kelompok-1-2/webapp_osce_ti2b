<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;

class KompetensiService
{
    /**
     * Mengambil daftar kompetensi berdasarkan aspek penilaian.
     */
    public function getByAspek(Request $request, AspekPenilaian $aspekPenilaian)
    {
        // Muat relasi stase
        $aspekPenilaian->load('stase');

        // Ambil data kompetensi dengan paginasi dan fitur pencarian
        $kompetensi = $aspekPenilaian->poinAspekPenilaian()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('kompetensi', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return [
            'aspek' => $aspekPenilaian,
            'kompetensi' => $kompetensi
        ];
    }

    /**
     * Logika penyimpanan kompetensi baru.
     */
    public function create(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $validated = $request->validate([
            'kompetensi' => 'required|string',
            'bobot' => 'required|integer|min:1|max:5',
        ]);

        return $aspekPenilaian->poinAspekPenilaian()->create($validated);
    }

    /**
     * Mengambil satu data kompetensi (berguna untuk edit/show).
     */
    public function getOne(PoinAspekPenilaian $kompetensi)
    {
        $kompetensi->load('aspekPenilaian.stase');
        return $kompetensi;
    }

    /**
     * Logika update kompetensi.
     */
    public function update(Request $request, PoinAspekPenilaian $kompetensi)
    {
        $validated = $request->validate([
            'kompetensi' => [
                'required',
                'string',
                // Validasi unik berdasarkan aspek penilaian terkait
                Rule::unique('poin_aspek_penilaian', 'kompetensi')
                    ->ignore($kompetensi->id_poin_aspek_penilaian, 'id_poin_aspek_penilaian')
                    ->where('id_aspek_penilaian', $kompetensi->id_aspek_penilaian)
            ],
            'bobot' => 'required|integer|min:1|max:5',
        ]);

        $kompetensi->update($validated);

        return $kompetensi;
    }

    /**
     * Logika hapus kompetensi.
     */
    public function delete(PoinAspekPenilaian $kompetensi)
    {
        return $kompetensi->delete();
    }
}
