<?php

namespace App\Services\Admin;

use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Imports\MahasiswaImport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;

class MahasiswaService
{
    /**
     * Mengambil daftar mahasiswa dengan filter dan paginasi.
     */
    public function getAll($search, $angkatan)
    {
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
            ->orderBy('id_mahasiswa', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                'kelas' => $mhs->kelas,
                'prodi' => $mhs->prodi,
            ]);

        return $mahasiswa;
    }

    /**
     * Logika validasi dan penyimpanan mahasiswa baru (Transaction).
     */
    public function store($validated)
    {
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
    public function update($validated, Mahasiswa $mahasiswa)
    {
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
     * Menangani proses import data mahasiswa dari file Excel.
     * Logika ini dipindahkan dari Controller untuk menjaga Controller tetap bersih.
     *
     * @param UploadedFile $file
     * @return void
     * @throws \Exception
     */
    public function importMahasiswa(UploadedFile $file)
    {
        // Menjalankan import menggunakan class MahasiswaImport yang sudah ada.
        // Jika terjadi error pada Excel::import, exception akan dilempar
        // dan ditangkap oleh controller.
        Excel::import(new MahasiswaImport, $file);
    }
}
