<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Imports\MahasiswaImport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;

class MahasiswaController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa (Halaman Utama)
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $angkatan = $request->input('angkatan'); // Ini memfilter kolom 'kelas'

        $mahasiswa = Mahasiswa::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%");
                });
            })
            ->when($angkatan, function ($query, $angkatan) {
                // 'angkatan' dari frontend adalah 'kelas' di DB
                $query->where('kelas', $angkatan); 
            })
            ->orderBy('nama')
            ->paginate(10) // Sesuaikan jumlah paginasi jika perlu
            ->withQueryString()
            ->through(fn ($mhs) => [ // Kirim data minimal ke frontend
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                // Tambahan agar Form Edit otomatis terisi saat tombol edit ditekan (tidak kosong).
                'kelas' => $mhs->kelas,
                'prodi' => $mhs->prodi,
            ]);

        // [PERBAIKAN] Render ke 'Admin/MahasiswaPage'
        return Inertia::render('Admin/MahasiswaPage', [
            'mahasiswa' => $mahasiswa,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatan,
            ],
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

        DB::transaction(function () use ($validated) {
            $pengguna = Pengguna::create([
                'username' => $validated['nim'],   
                'password' => $validated['nim'], // Default password = NIM
                'jenis_role' => 'mahasiswa',
            ]);

            Mahasiswa::create([
                'id_pengguna' => $pengguna->id_pengguna,
                'nim'   => $validated['nim'],
                'nama'  => $validated['nama'],
                'kelas' => $validated['kelas'],
                'prodi' => $validated['prodi'],
                'status' => 'aktif',
            ]);
        });

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
        
        DB::transaction(function () use ($validated, $mahasiswa) {
            $mahasiswa->update([
                'nim'   => $validated['nim'],
                'nama'  => $validated['nama'],
                'kelas' => $validated['kelas'],
                'prodi' => $validated['prodi'],
            ]);

            if ($mahasiswa->pengguna) {
                $mahasiswa->pengguna->update([
                    'username' => $validated['nim'],
                ]);
            }
        });

        return Redirect::route('admin.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diperbarui.');
    }

    /**
     * [BARU] Menghapus data mahasiswa
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        DB::transaction(function () use ($mahasiswa) {
            // Hapus data Pengguna yang terkait
            if ($mahasiswa->pengguna) {
                $mahasiswa->pengguna->delete();
            }
            // Hapus data Mahasiswa
            $mahasiswa->delete();
        });

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
            Excel::import(new MahasiswaImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data mahasiswa berhasil diimpor.');
        } catch (\Exception $e) {
            // Tangkap error jika import gagal
            return redirect()->back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }
}