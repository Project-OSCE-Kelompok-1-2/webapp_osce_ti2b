<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class MahasiswaController extends Controller
{
    /**
     * Menampilkan daftar mahasiswa dengan filter search dan angkatan (kelas).
     */
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
            ->with('pengguna') // relasi agar bisa lihat akun pengguna
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

    /**
     * Menambahkan data pengguna (role mahasiswa) dan mahasiswa yang terhubung.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nim'   => 'required|string|max:20|unique:mahasiswa,nim',
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Buat akun pengguna baru
            $pengguna = Pengguna::create([
                'username' => $validated['nim'], // gunakan NIM sebagai username
                'password' => $validated['nim'], // password default (akan di-hash otomatis via cast)
                'jenis_role' => 'mahasiswa',
            ]);

            // 2. Buat data mahasiswa yang terhubung dengan pengguna
            Mahasiswa::create([
                'id_pengguna' => $pengguna->id_pengguna,
                'nim'   => $validated['nim'],
                'nama'  => $validated['nama'],
                'kelas' => $validated['kelas'],
                'prodi' => $validated['prodi'],
                'status' => 'aktif',
            ]);
        });

        return Redirect::route('admin.mahasiswa.index')->with('success', 'Mahasiswa baru berhasil ditambahkan.');
    }
}
