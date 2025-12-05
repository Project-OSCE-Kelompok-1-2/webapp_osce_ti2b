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
    public function getByAspek(AspekPenilaian $aspekPenilaian, $search)
    {
        // Ambil data kompetensi dengan paginasi
        $kompetensi = $aspekPenilaian->poinAspekPenilaian()
            ->when($search, function ($query, $search) {
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
    public function update(PoinAspekPenilaian $kompetensi, $validated)
    {
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
