<?php

namespace App\Services;

use App\Models\Stase;
use App\Models\AspekPenilaian;
use Illuminate\Http\Request;

class AspekPenilaianService
{
    /**
     * Mengambil data aspek penilaian dengan struktur sesuai permintaan.
     */
    public function getByStase( Stase $stase, $search)
    {
        // Query dasar
        $aspek_penilaian = AspekPenilaian::where('id_stase', $stase->id_stase)
            ->when($search, function ($query, $search) {
                $query->where('aspek', 'like', "%{$search}%");
            })
            // Menghitung jumlah kompetensi (relation count)
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->paginate(10)
            ->withQueryString();

        // TRANSFORMASI: Mengubah setiap item agar sesuai struktur JSON yang diminta
        $aspek_penilaian->getCollection()->transform(function ($item) {
            return [
                'id_aspek_penilaian' => $item->id_aspek_penilaian,
                'aspek'              => $item->aspek,
                'bobot_maksimum'     => $item->bobot_maksimum,
                'jumlah_kompetensi'  => $item->jumlah_kompetensi, // Data dari withCount
            ];
        });

        return $aspek_penilaian;
    }

    /**
     * Logic validasi dan penyimpanan data baru.
     */
    public function create(Stase $stase, $validated)
    {
        return $stase->aspekPenilaian()->create($validated);
    }

    /**
     * Logic validasi dan update data.
     */
    public function update(AspekPenilaian $aspekPenilaian, $validated)
    {
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
