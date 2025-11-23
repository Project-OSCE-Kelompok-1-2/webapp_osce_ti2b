<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;

class KompetensiService
{
    /**
     * Mengambil daftar kompetensi dengan transformasi struktur data.
     */
    public function getByAspek(Request $request, AspekPenilaian $aspekPenilaian)
    {
        // Ambil data kompetensi dengan paginasi
        $kompetensi = $aspekPenilaian->poinAspekPenilaian()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('kompetensi', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        // TRANSFORMASI: Sesuaikan struktur data dengan permintaan
        $kompetensi->getCollection()->transform(function ($item) {
            return [
                'id_poin_aspek_penilaian' => $item->id_poin_aspek_penilaian,
                'kompetensi' => $item->kompetensi,
                'skor' => $item->skor ?? 0, // Default 0 jika null
                'bobot' => $item->bobot,
            ];
        });

        return $kompetensi;
    }

    /**
     * Logika penyimpanan kompetensi baru.
     */
    public function create(AspekPenilaian $aspekPenilaian, $validated)
    {
        return $aspekPenilaian->poinAspekPenilaian()->create($validated);
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
                // Validasi unik, kecuali untuk ID ini
                Rule::unique('poin_aspek_penilaian', 'kompetensi')
                    ->ignore($kompetensi->id_poin_aspek_penilaian, 'id_poin_aspek_penilaian')
                    ->where('id_aspek_penilaian', $kompetensi->id_aspek_penilaian)
            ],
            'skor' => 'required|integer|min:0', // Ditambahkan
            'bobot' => 'required|integer|min:1',
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
