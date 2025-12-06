<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Stase;
use Illuminate\Http\Request;
use App\Models\AspekPenilaian;
use App\Http\Controllers\Controller;
use App\Services\AspekPenilaianService;
use Illuminate\Support\Facades\Redirect;

class AspekPenilaianController extends Controller
{
    protected $service;

    public function __construct(AspekPenilaianService $aspekPenilaianService)
    {
        $this->service = $aspekPenilaianService;
    }

    // Menggantikan get_aspek_penilaian
    public function index(Request $request, Stase $stase)
    {
        $search = $request->query("search");
        $aspek_penilaian =  $this->service->getByStase($stase, $search);
        // Sekarang Anda bisa mengakses properti 'nama' yang sudah Anda buat di Service.
        // dd($aspek_penilaian);
        return Inertia::render('Admin/MenuAspekPenilaian', [
            'stase' => $stase,
            'aspek_penilaian' => $aspek_penilaian,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create(Stase $stase)
    {
        return Inertia::render('Admin/TambahAspekPenilaian', [
            'stase' => $stase,
            'aspek' => null, // Kirim null untuk mode 'create'
        ]);
    }

    /**
     * Menyimpan Aspek Penilaian baru.
     */
    public function store(Request $request, Stase $stase)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);

        $this->service->create($stase, $validated);

        return Redirect::route('admin.stase.aspek-penilaian.index', $stase->id_stase)
            ->with('success', 'Aspek Penilaian berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit Aspek Penilaian.
     */
    public function edit(AspekPenilaian $aspekPenilaian)
    {
        $aspekPenilaian->load('stase'); // Load relasi untuk breadcrumb
        return Inertia::render('Admin/TambahAspekPenilaian', [
            'stase' => $aspekPenilaian->stase,
            'aspek' => $aspekPenilaian, // Kirim data aspek untuk di-edit
        ]);
    }

    /**
     * Memperbarui Aspek Penilaian.
     */
    public function update(Request $request, AspekPenilaian $aspekPenilaian)
    {
        $validated = $request->validate([
            'aspek' => 'required|string',
            'bobot_maksimum' => 'required|integer|min:0',
        ]);

        $aspekPenilaian = $this->service->update($aspekPenilaian, $validated);

        return Redirect::route('admin.stase.aspek-penilaian.index', $aspekPenilaian->id_stase)
            ->with('success', 'Aspek Penilaian berhasil diperbarui.');
    }

    public function destroy(AspekPenilaian $aspekPenilaian)
    {
        // CATATAN: Hapus semua "poin kompetensi" yang terkait dulu
        // untuk menghindari error foreign key (jika tidak di-setting ON DELETE CASCADE)
        $this->service->delete($aspekPenilaian);

        // Redirect kembali ke halaman sebelumnya dengan pesan sukses
        return Redirect::back()->with('success', 'Aspek penilaian berhasil dihapus.');
    }
}
