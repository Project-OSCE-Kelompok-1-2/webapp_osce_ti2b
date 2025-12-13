<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Services\Admin\MahasiswaService;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;
use App\Exports\TemplateMahasiswaExport;

class MahasiswaController extends Controller
{
    protected $service;

    public function __construct(MahasiswaService $service)
    {
        $this->service = $service;
    }

    /**
     * Menampilkan daftar mahasiswa (Halaman Utama)
     */
    public function index(Request $request)
{
    // 1. Ambil List Tahun untuk Dropdown
    $listTahun = TahunAkademik::select('tahun')
        ->distinct()
        ->orderBy('tahun', 'desc')
        ->pluck('tahun');

    // 2. Ambil parameter filter dari Request
    $search = $request->input('search');
    $angkatan = $request->input('angkatan');

    // 3. [PERBAIKAN] Panggil Service, jangan query manual!
    // Service ini sudah memuat logika 'with(enrollment)' dan transformasi data 'angkatan'
    $mahasiswa = $this->service->getAll($search, $angkatan);

    return Inertia::render('Admin/MahasiswaPage', [
        'mahasiswa' => $mahasiswa, 
        'list_tahun' => $listTahun,
        'filters' => $request->only(['search', 'angkatan']),
    ]);
}

    /**
     * Menampilkan halaman form untuk menambah mahasiswa
     */
    public function create()
    {
        return Inertia::render('Admin/TambahMahasiswa', [
            'mahasiswa' => null,
        ]);
    }

    /**
     * Menyimpan mahasiswa baru (Form Submit)
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'nim'   => [
            'required', 'string', 'max:20', 'unique:mahasiswa,nim',
            function ($attribute, $value, $fail) {
                if (Pengguna::where('username', $value)->exists()) {
                    $fail('NIM ini sudah digunakan sebagai username.');
                }
            },
        ],
        'nama'  => 'required|string|max:255',
        'kelas' => 'required|string|max:50',
        'prodi' => 'required|string|max:100',
        
        // TAMBAHKAN BARIS INI AGAR DATA TAHUN DITERIMA
        'angkatan' => 'required|string', 
    ]);

    $this->service->store($validated);

    return Redirect::route('admin.mahasiswa.index')
        ->with('success', 'Mahasiswa baru berhasil ditambahkan.');
}

    /**
     * Menampilkan halaman form untuk mengedit mahasiswa
     */
    public function edit(Mahasiswa $mahasiswa)
    {
        return Inertia::render('Admin/TambahMahasiswa', [
            'mahasiswa' => [
                'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                'kelas' => $mahasiswa->kelas,
                'prodi' => $mahasiswa->prodi,
            ],
        ]);
    }

    /**
     * Menyimpan perubahan data mahasiswa (Edit Submit)
     */
    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'nim'   => [
                'required',
                'string',
                'max:20',
                'unique:mahasiswa,nim,' . $mahasiswa->id_mahasiswa . ',id_mahasiswa',
                function ($attribute, $value, $fail) use ($mahasiswa) {
                    if (Pengguna::where('username', $value)->where('id_pengguna', '!=', $mahasiswa->id_pengguna)->exists()) {
                        $fail('NIM ini sudah digunakan sebagai username oleh pengguna lain.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
            'angkatan' => 'required|string',
        ]);

        $this->service->update($validated, $mahasiswa);

        return Redirect::route('admin.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    /**
     * Menghapus data mahasiswa
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $this->service->delete($mahasiswa);

        return Redirect::back()->with('success', 'Mahasiswa berhasil dihapus.');
    }

    /**
     * Download Template Excel
     */
    public function template()
    {
        return Excel::download(new TemplateMahasiswaExport, 'template_mahasiswa.xlsx');
    }

    /**
     * Mengimpor data mahasiswa dari Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        try {
            $this->service->importMahasiswa($request->file('file'));
            return redirect()->back()->with('success', 'Data mahasiswa berhasil diimpor.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }
}