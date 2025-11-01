<?php

namespace App\Http\Controllers;

use App\Models\Osce;
use App\Models\OsceStase; // Model pivot/penghubung
use Illuminate\Http\Request;
use Inertia\Inertia;

class OsceStaseController extends Controller
{
    /**
     * Menampilkan semua stase yang terkait dengan OSCE tertentu.
     * Sesuai dengan UI dan endpoint: /osce/{id}/stase
     *
     * @param Request $request
     * @param int $id_osce ID dari OSCE
     * @return \Inertia\Response
     */
    public function index(Request $request, $id_osce)
    {
        // 1. Ambil data OSCE utama untuk judul halaman
        // Kita gunakan findOrFail agar otomatis 404 jika OSCE tidak ditemukan
        $osce = Osce::findOrFail($id_osce);

        // 2. Mulai query builder untuk OsceStase
        $query = OsceStase::query()
            // Filter berdasarkan id_osce dari URL
            ->where('id_osce', $id_osce)
            // Ambil relasi yang diperlukan sesuai tabel di UI
            // Asumsi:
            // - Model OsceStase punya relasi 'stase()'
            // - Model OsceStase punya relasi 'penguji()'
            ->with(['stase', 'penguji']);

        // 3. Terapkan filter pencarian (sesuai UI "cari data stase...")
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            // 'whereHas' untuk mencari di dalam relasi 'stase'
            $query->whereHas('stase', function ($q) use ($searchTerm) {
                $q->where('nama_stase', 'like', '%' . $searchTerm . '%');
            });
            // Anda juga bisa menambahkan pencarian berdasarkan ruangan atau penguji
            // $query->orWhere('ruangan', 'like', '%' . $searchTerm . '%');
            // $query->orWhereHas('penguji', ...);
        }

        // 4. Eksekusi query
        // Kita tidak perlu paginasi dulu sesuai UI, tapi bisa ditambahkan .paginate()
        $osceStasesData = $query->get();

        // 5. Format data untuk dikirim ke Inertia
        // Ini akan merapikan data agar mudah digunakan di frontend
        $formattedStases = $osceStasesData->map(function ($osceStase) {
            return [
                'id'         => $osceStase->id_osce_stase, // ID unik dari baris OsceStase
                'ruangan'    => $osceStase->ruangan,       // Misal: "B-012"
                'stase'      => $osceStase->stase->nama_stase ?? 'Stase tidak ditemukan', // Misal: "Stase 01-A"
                'penguji'    => $osceStase->penguji->nama ?? 'Penguji belum diatur', // Misal: "Dr. Pandu Setya Nugraha,..."
                
                // ID relasi mungkin berguna untuk 'action' (edit/delete)
                'id_stase'   => $osceStase->id_stase,
                'id_penguji' => $osceStase->id_penguji,
            ];
        });

        // 6. Render komponen Inertia
        // Asumsi nama komponennya 'Osce/HalamanStase' berdasarkan UI
        return Inertia::render('Osce/HalamanStase', [
            // Data OSCE utama (untuk judul)
            'osce' => [
                'id' => $osce->id_osce,
                'nama' => $osce->nama_osce, // Misal: "Radiologi 01-A"
                // tambahkan data osce lain jika perlu
            ],
            
            // Data stase yang sudah diformat
            'stases' => $formattedStases,
            
            // Kirim filter yang sedang aktif
            'filters' => $request->only(['search']),
        ]);
    }

    // --- FUNGSI LAIN (create, store, edit, update, destroy untuk OsceStase) ---
    // public function store(Request $request, $id_osce) { ... }
    // (Untuk tombol "Masukkan Stase")
    
    // public function update(Request $request, $id_osce, $id_osce_stase) { ... }
    // (Untuk tombol "Edit")

    // public function destroy($id_osce, $id_osce_stase) { ... }
    // (Untuk tombol "Delete")
}
