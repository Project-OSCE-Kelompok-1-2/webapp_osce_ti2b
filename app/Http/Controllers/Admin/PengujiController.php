<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect; // Pastikan Redirect di-import

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
        
        // [PERBAIKAN] Paginate dan format data
        $dosen = $query->orderBy('nama')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($penguji) => [
                'id_penguji' => $penguji->id_penguji,
                'nip' => $penguji->nip,
                'nama' => $penguji->nama,
            ]);

        // [PERBAIKAN] Render ke 'Admin/PengujiPage'
        return Inertia::render('Admin/PengujiPage', [
            'dosen' => $dosen, // 'dosen' adalah nama prop di React
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * [BARU] Menampilkan form untuk menambah penguji
     * GET /admin/dosen/create
     */
    public function create()
    {
        // Anda perlu membuat file 'Admin/PengujiFormPage.jsx'
        return Inertia::render('Admin/TambahPenguji', [
            'dosen' => null, // Kirim null untuk mode 'create'
        ]);
    }


    /**
     * TUGAS 2: POST /admin/dosen (Create Penguji)
     */
    public function store(Request $request)
    {
        dd($request->all());
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
            // Model Pengguna akan otomatis hash password jika di-set di $casts
            $pengguna = Pengguna::create([
                'username' => $validated['nip'],
                'password' => $validated['nip'], // Default password = NIP
                'jenis_role' => 'penguji',
            ]);

            Penguji::create([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'id_pengguna' => $pengguna->id_pengguna,
            ]);
            
            DB::commit();

            // [PERBAIKAN] Redirect ke route 'index'
            return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GAGAL MEMBUAT PENGUJI BARU: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Gagal menambahkan data penguji. Terjadi kesalahan server.');
        }
    }

    /**
     * [BARU] Menampilkan form untuk mengedit penguji
     * GET /admin/dosen/{dosen}/edit
     */
    public function edit(Penguji $dosen) // 'dosen' adalah nama parameter dari resource
    {
        return Inertia::render('Admin/TambahPenguji', [
            'dosen' => [
                'id_penguji' => $dosen->id_penguji,
                'nip' => $dosen->nip,
                'nama' => $dosen->nama,
            ],
        ]);
    }

    /**
     * [BARU] Menyimpan perubahan data penguji
     * PUT /admin/dosen/{dosen}
     */
    public function update(Request $request, Penguji $dosen)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required', 'string', 'max:255',
                Rule::unique('penguji', 'nip')->ignore($dosen->id_penguji, 'id_penguji'),
                Rule::unique('pengguna', 'username')->ignore($dosen->id_pengguna, 'id_pengguna'),
            ],
        ]);

        DB::beginTransaction();
        try {
            $dosen->update([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
            ]);

            if ($dosen->pengguna) {
                $dosen->pengguna->update([
                    'username' => $validated['nip'],
                ]);
            }
            
            DB::commit();
            return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GAGAL UPDATE PENGUJI: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Gagal memperbarui data penguji.');
        }
    }

    /**
     * [BARU] Menghapus data penguji
     * DELETE /admin/dosen/{dosen}
     */
    public function destroy(Penguji $dosen)
    {
        DB::beginTransaction();
        try {
            // Hapus Pengguna (akun login)
            if ($dosen->pengguna) {
                $dosen->pengguna->delete();
            }
            // Hapus Penguji
            $dosen->delete();
            
            DB::commit();
            return Redirect::back()->with('success', 'Penguji berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GAGAL HAPUS PENGUJI: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Gagal menghapus penguji. Mungkin terkait dengan data lain.');
        }
    }
}