<?php

namespace App\Services;

use App\Models\Stase;
use App\Models\AspekPenilaian;
use Illuminate\Http\Request;

class AspekPenilaianService
{
    /**
     * Mengambil data aspek penilaian dengan filter dan transformasi yang sama persis.
     */
    public function getByStase(Request $request, Stase $stase)
    {
        $aspek_penilaian = AspekPenilaian::where('id_stase', $stase->id_stase)
            ->when($request->input('search'), function ($query, $search) {
                $query->where('aspek', 'like', "%{$search}%");
            })
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->paginate(10)
            ->withQueryString();

        // Mengubah nama kolom agar konsisten (Logic asli dipertahankan)
        $aspek_penilaian->getCollection()->transform(function ($item) {
            $item->nama = $item->aspek;
            $item->bobot = $item->bobot_maksimum;
            $item->id = $item->id_aspek_penilaian;
            return $item;
        });

        return $aspek_penilaian;
    }

    /**
     * Logic validasi dan penyimpanan data baru.
     */
    public function create(Request $request, Stase $stase)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);

        return $stase->aspekPenilaian()->create($validated);
    }

    /**
     * Logic validasi dan update data.
     */
    public function update(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);

        $aspekPenilaian->update($validated);

        return $aspekPenilaian;
    }

    /**
     * Logic penghapusan data (termasuk relasi poin).
     */
    public function delete(AspekPenilaian $aspekPenilaian)
    {
        // Hapus semua "poin kompetensi" yang terkait dulu
        $aspekPenilaian->poinAspekPenilaian()->delete();

        // Hapus data aspek penilaian
        return $aspekPenilaian->delete();
    }
}
