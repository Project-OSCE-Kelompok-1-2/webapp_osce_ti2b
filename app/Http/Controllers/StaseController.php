<?php

namespace App\Http\Controllers;

use App\Models\Stase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaseController extends Controller
{
    // ... fungsi index sebelumnya (jika ada) ...

    /**
     * Mengambil semua data Stase dengan format minimal: id, nama, jumlah_aspek.
     * Method: GET
     * Endpoint: /api/stase/minimal (contoh)
     */
    public function get_all_stase()
    {
        // 1. Ambil data Stase dan hitung relasi 'aspekPenilaian'
        $stases = Stase::query()
            // Menghitung jumlah aspek penilaian dan memberinya alias 'jumlah_kompetensi'
            ->withCount("aspekPenilaian as jumlah_kompetensi")
            
            // 2. Eksekusi query untuk mendapatkan semua data
            ->get(); 

        // 3. Format ulang data hanya untuk menyertakan kolom yang diminta (id, nama, jumlah_kompetensi)
        $formattedStases = $stases->map(function ($stase) {
            return [
                // Pastikan nama kolom sesuai dengan nama di database dan alias 'id' yang Anda inginkan
                'id' => $stase->id_stase, 
                'nama' => $stase->nama_stase,
                
                // Mengambil hasil hitungan (alias dari withCount)
                'jumlah_aspek' => $stase->jumlah_kompetensi, 
            ];
        });
        
        // 4. Kirim data yang sudah diformat ke komponen Inertia
        return Inertia::render("Stase", [
            // Kirim array yang sudah diformat
            "data" => $formattedStases 
        ]);
    }

    // ... fungsi lain ...
}
