<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use App\Imports\MahasiswaImport;
use Maatwebsite\Excel\Facades\Excel;

class MahasiswaController extends Controller
{
    // Menammpilkan daftar mahasiswa dengan filter pencarian dan angkatan (kelas) 
    public function index(Request $request)
    {
        $search = $request->input('search');
        $angkatan = $request->input('angkatan');

        $mahasiswa = Mahasiswa::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nim', 'like', "%{$search}%");
                });
            })
            ->when($angkatan, function ($query, $angkatan) {
                $query->where('kelas', 'like', "%{$angkatan}%");
            })
            ->with('pengguna')
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/MenuMahasiswa', [
            'mahasiswa' => $mahasiswa,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatan,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nim'   => [
                'required',
                'string',
                'max:20',
                'unique:mahasiswa,nim',
                function ($attribute, $value, $fail) {
                    if (Pengguna::where('username', $value)->exists()) {
                        $fail('NIM ini sudah digunakan sebagai username di tabel pengguna.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
        ]);

        DB::transaction(function () use ($validated) {
            // Buat akun pengguna baru (role mahasiswa)
            $pengguna = Pengguna::create([
                'username' => $validated['nim'],   
                'password' => $validated['nim'],   
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        Excel::import(new MahasiswaImport, $request->file('file'));

        return redirect()->back()->with('success', 'Data mahasiswa berhasil diimport.');
    }
}


