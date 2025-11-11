<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penguji;
use App\Models\Pengguna;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;      
use Illuminate\Support\Facades\Log;     
use Illuminate\Validation\Rule;         
class PengujiController extends Controller
{
    /**
     * TUGAS 1: GET /admin/dosen (List Penguji)
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

        return Inertia::render('Admin/Penguji', [
            'penguji' => $penguji,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * TUGAS 2: POST /admin/dosen (Create Penguji)
     */
    public function store(Request $request)
    {
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
            $pengguna = Pengguna::create([
                'username' => $validated['nip'],
                'password' => $validated['nip'],
                'jenis_role' => 'penguji',
            ]);

            $penguji = Penguji::create([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'id_pengguna' => $pengguna->id_pengguna,
            ]);

            DB::commit();

            return redirect()->route('admin.dosen.index')->with('success', 'Data penguji berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('GAGAL MEMBUAT PENGUJI BARU: ' . $e->getMessage());

            return back()->with('error', 'Gagal menambahkan data penguji. Terjadi kesalahan server.');
        }
    }
}