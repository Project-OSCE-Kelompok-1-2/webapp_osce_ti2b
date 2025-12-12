<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\Admin\PengujiService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect; // Pastikan Redirect di-import

class PengujiController extends Controller
{
    protected $service;

    public function __construct(PengujiService $service)
    {
        $this->service = $service;
    }

    /**
     * TUGAS 1: GET /admin/dosen (List Penguji)
     */
    public function index(Request $request)
    {
        // [PERUBAHAN] Ambil SEMUA data untuk Client-Side Pagination
        // Jangan gunakan paginate(), gunakan get()
        $dosen = Penguji::orderBy('nama', 'asc')->get();

        return Inertia::render('Admin/PengujiPage', [
            'dosen' => $dosen, // Mengirim Array Full
            'filters' => [],   // Filter kosong karena dihandle frontend
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
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip'),
                Rule::unique('pengguna', 'username'),
            ],
        ]);

        $penguji = $this->service->create($validated);

        if (!$penguji) {
            return Redirect::back()->with('error', 'Gagal menambahkan data penguji. Terjadi kesalahan server.');
        }

        return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil ditambahkan.');
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
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip')->ignore($dosen->id_penguji, 'id_penguji'),
                Rule::unique('pengguna', 'username')->ignore($dosen->id_pengguna, 'id_pengguna'),
            ],
        ]);

        $penguji = $this->service->update($dosen, $validated);

        if (!$penguji) {
            return Redirect::back()->with('error', 'Gagal memperbarui data penguji.');
        }

        return Redirect::route('admin.dosen.index')->with('success', 'Data penguji berhasil diperbarui.');
    }

    /**
     * [BARU] Menghapus data penguji
     * DELETE /admin/dosen/{dosen}
     */
    public function destroy(Penguji $dosen)
    {
        // Panggil service delete
        $isDeleted = $this->service->delete($dosen);

        // Jika $isDeleted bernilai false/gagal, baru lempar error.
        if (!$isDeleted) {
            return Redirect::back()->with('error', 'Gagal menghapus penguji. Mungkin terkait dengan data lain.');
        }

        // Jika berhasil
        return Redirect::back()->with('success', 'Penguji berhasil dihapus.');
    }
}
