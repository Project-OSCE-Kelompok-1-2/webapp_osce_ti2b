<?php

namespace App\Services\Admin;

use App\Models\Stase;
use App\Models\AspekPenilaian;
use Illuminate\Http\Request;

class AspekPenilaianService
{
    /**
     * Mengambil data aspek penilaian dengan struktur sesuai permintaan.
     */
    public function getByStase(Stase $stase) 
    {
        // Query dasar
        $aspek_penilaian = AspekPenilaian::where('id_stase', $stase->id_stase)
            // [HAPUS] Logic search dihilangkan agar semua data terambil
            // ->when($search, function ($query, $search) { ... }) 
            
            // Menghitung jumlah kompetensi (relation count)
            ->withCount('poinAspekPenilaian as jumlah_kompetensi')
            ->orderBy('created_at', 'asc') // [TAMBAH] Sorting biar rapi
            
            // [PENTING] Ganti paginate(10) menjadi get()
            ->get(); 

        // TRANSFORMASI: 
        // Karena pakai get(), hasilnya adalah Collection, bukan Paginator.
        // Jadi tidak perlu ->getCollection(), langsung saja ->transform()
        $aspek_penilaian->transform(function ($item) {
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
