<?php

namespace App\Http\Controllers;

// --- Imports ---
use Illuminate\Http\Request;
use App\Models\Penguji;
use App\Models\Pengguna;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;       // Untuk Transaksi
use Illuminate\Support\Facades\Log;      // Untuk Error Logging
use Illuminate\Validation\Rule;          // Untuk Validasi Unik

// (Hash TIDAK diperlukan untuk create, karena Model sudah $casts)
// use Illuminate\Support\Facades\Hash; 

class PengujiController extends Controller
{
    /**
     * TUGAS 1: GET /admin/dosen (List Penguji)
     * (Ini sudah LULUS)
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = Penguji::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'LIKE', '%' . $search . '%')
                  ->orWhere('nip', 'LIKE', '%' . $search . '%');
            });
        }
        
        $penguji = $query->paginate(10)->appends($request->query());

        // Render komponen frontend 'Admin/Penguji'
        return Inertia::render('Admin/Penguji', [
            'penguji' => $penguji,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * TUGAS 2: POST /admin/dosen (Create Penguji)
     * (INI ADALAH FUNGSI YANG GAGAL)
     * * GANTI FUNGSI 'store' ANDA DENGAN INI:
     */
    public function store(Request $request)
    {
        // 1. Validasi (Sudah LULUS)
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required', 'string', 'max:255',
                Rule::unique('penguji', 'nip'),
                Rule::unique('pengguna', 'username'),
            ],
        ]);

        DB::beginTransaction();

        try {
            // --------------------------------------------------------
            // PERBAIKAN 1: Password Hashing
            // Model Pengguna Anda menggunakan $casts = ['password' => 'hashed'].
            // JANGAN gunakan Hash::make() di sini.
            // --------------------------------------------------------
            $pengguna = Pengguna::create([
                'username' => $validated['nip'],
                'password' => $validated['nip'], // Berikan sebagai Teks Biasa
                'jenis_role' => 'penguji',
            ]);

            // --------------------------------------------------------
            // PERBAIKAN 2: Primary Key
            // Primary Key Model Pengguna Anda adalah 'id_pengguna', BUKAN 'id'.
            // --------------------------------------------------------
            $penguji = Penguji::create([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'id_pengguna' => $pengguna->id_pengguna, // <-- Gunakan id_pengguna
            ]);
            
            // Jika kedua 'create' berhasil, commit
            DB::commit();

            // Tes akan melihat redirect ini dan LULUS
            return redirect()->route('admin.dosen.index')->with('success', 'Data penguji berhasil ditambahkan.');

        } catch (\Exception $e) {
            // Ini adalah bagian yang dieksekusi sekarang (menyebabkan GAGAL)
            DB::rollBack();
            
            // Tulis error ke log untuk debugging
            Log::error('GAGAL MEMBUAT PENGUJI BARU: ' . $e->getMessage());

            // Redirect 'back()' (yang dilihat tes sebagai 'http://localhost')
            return back()->with('error', 'Gagal menambahkan data penguji. Terjadi kesalahan server.');
        }
    }
}