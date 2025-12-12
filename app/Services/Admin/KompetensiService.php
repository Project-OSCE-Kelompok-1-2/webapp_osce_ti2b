<?php

namespace App\Services\Admin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;

class KompetensiService
{
    /**
     * Mengambil daftar kompetensi dengan transformasi struktur data.
     */
    public function getByAspek(AspekPenilaian $aspekPenilaian)
    {
        // Ambil semua data kompetensi (tanpa paginate)
        $kompetensi = $aspekPenilaian->poinAspekPenilaian()
            // [HAPUS] Logic search dihilangkan agar semua data terambil
            // ->when($search, function ($query, $search) { ... }) 
            
            ->orderBy('created_at', 'asc') // [TAMBAH] Sorting biar rapi
            
            // [PENTING] Ganti paginate(10) menjadi get()
            ->get(); 

        // TRANSFORMASI: 
        // Karena pakai get(), hasilnya adalah Collection. Langsung transform saja.
        $kompetensi->transform(function ($item) {
            return [
                'id_poin_aspek_penilaian' => $item->id_poin_aspek_penilaian,
                'kompetensi' => $item->kompetensi,
                'skor' => $item->skor ?? 0,
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
