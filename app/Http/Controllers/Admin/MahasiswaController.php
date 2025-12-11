<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Imports\MahasiswaImport;
use App\Services\Admin\MahasiswaService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;

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
        $search = $request->input('search');
        $angkatan = $request->input('angkatan'); // Ini memfilter kolom 'kelas'

        // Jika 'SEMUA', atau kosong, atau null -> jadikan null agar tidak difilter
        if ($angkatan === "SEMUA" || $angkatan === "" || empty($angkatan) || $angkatan === "null") {
            $angkatan = null;
        }
        
        // Ambil List Tahun dari Database untuk Dropdown
        $listTahun = TahunAkademik::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // Query Mahasiswa dengan Relasi
        $mahasiswa = $this->service->getAll($search, $angkatan);

        // [PERBAIKAN] Render ke 'Admin/MahasiswaPage'
        return Inertia::render('Admin/MahasiswaPage', [
            'mahasiswa' => $mahasiswa,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatan,
            ],
            'list_tahun' => $listTahun, // Kirim list tahun ke frontend
        ]);
    }

    /**
     * [BARU] Menampilkan halaman form untuk menambah mahasiswa
     */
    public function create()
    {
        // Anda perlu membuat file 'Admin/MahasiswaFormPage.jsx'
        // untuk menampilkan form ini.
        return Inertia::render('Admin/TambahMahasiswa', [
            'mahasiswa' => null, // Kirim null untuk mode 'create'
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
                        $fail('NIM ini sudah digunakan sebagai username di tabel pengguna.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50', // Ini adalah 'angkatan' di form
            'prodi' => 'required|string|max:100',
        ]);


        $this->service->store($validated);

        return Redirect::route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa baru berhasil ditambahkan.');
    }

    /**
     * [BARU] Menampilkan halaman form untuk mengedit mahasiswa
     */
    public function edit(Mahasiswa $mahasiswa)
    {
        // Menggunakan form yang sama dengan 'create', tapi kirim data
        return Inertia::render('Admin/TambahMahasiswa', [
            // Kirim data lengkap mahasiswa untuk di-edit
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
     * [BARU] Menyimpan perubahan data mahasiswa (Edit Submit)
     */
    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'nim'   => [
                'required', 'string', 'max:20', 
                'unique:mahasiswa,nim,' . $mahasiswa->id_mahasiswa . ',id_mahasiswa', // Abaikan diri sendiri
                function ($attribute, $value, $fail) use ($mahasiswa) {
                    if (Pengguna::where('username', $value)->where('id_pengguna', '!=', $mahasiswa->id_pengguna)->exists()) {
                        $fail('NIM ini sudah digunakan sebagai username oleh pengguna lain.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
        ]);

        $this->service->update($validated, $mahasiswa);

        return Redirect::route('admin.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    /**
     * [BARU] Menghapus data mahasiswa
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $this->service->delete($mahasiswa);

        return Redirect::back()->with('success', 'Mahasiswa berhasil dihapus.');
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
            // Tangkap error jika import gagal
            return redirect()->back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }
}