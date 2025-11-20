<?php

namespace App\Services;

use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Imports\MahasiswaImport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class MahasiswaService
{
    /**
     * Mengambil daftar mahasiswa dengan filter dan paginasi.
     */
    public function getAll(Request $request)
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
                $query->where('kelas', $angkatan);
            })
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
            ]);

        return $mahasiswa;
    }

    /**
     * Logika validasi dan penyimpanan mahasiswa baru (Transaction).
     */
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

        return DB::transaction(function () use ($validated) {
            $pengguna = Pengguna::create([
                'username' => $validated['nim'],
                'password' => $validated['nim'], // Default password = NIM
                'jenis_role' => 'mahasiswa',
            ]);

            return Mahasiswa::create([
                'id_pengguna' => $pengguna->id_pengguna,
                'nim'   => $validated['nim'],
                'nama'  => $validated['nama'],
                'kelas' => $validated['kelas'],
                'prodi' => $validated['prodi'],
                'status' => 'aktif',
            ]);
        });
    }

    /**
     * Mengambil data satu mahasiswa (format sesuai kebutuhan edit).
     */
    public function getOne(Mahasiswa $mahasiswa)
    {
        return [
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'nim' => $mahasiswa->nim,
            'nama' => $mahasiswa->nama,
            'kelas' => $mahasiswa->kelas,
            'prodi' => $mahasiswa->prodi,
        ];
    }

    /**
     * Logika validasi dan update mahasiswa (Transaction).
     */
    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'nim'   => [
                'required',
                'string',
                'max:20',
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

        return $mahasiswa->refresh();
    }

    /**
     * Logika hapus mahasiswa (Transaction).
     */
    public function delete(Mahasiswa $mahasiswa)
    {
        return DB::transaction(function () use ($mahasiswa) {
            // Hapus data Pengguna yang terkait
            if ($mahasiswa->pengguna) {
                $mahasiswa->pengguna->delete();
            }
            // Hapus data Mahasiswa
            return $mahasiswa->delete();
        });
    }

    /**
     * Logika import Excel.
     */
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        // Excel::import tidak mengembalikan data, jadi kita return true jika sukses
        Excel::import(new MahasiswaImport, $request->file('file'));

        return true;
    }
}
