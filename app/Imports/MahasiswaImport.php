<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MahasiswaImport implements ToCollection, WithHeadingRow
{
    /**
     * [PENTING]
     * Menentukan posisi baris Header.
     * Kita set ke 2, karena baris 1 berisi teks instruksi/peringatan.
     */
    public function headingRow(): int
    {
        return 2;
    }

    /**
     * @param Collection $rows
     * Format header Excel (di baris 2):
     * nim | nama | kelas | prodi
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // Validasi sederhana: Pastikan NIM dan Nama ada
            if (!isset($row['nim']) || !isset($row['nama'])) {
                continue;
            }

            // Cegah duplikasi NIM jika mahasiswa sudah ada
            if (Mahasiswa::where('nim', $row['nim'])->exists()) {
                continue;
            }

            // 1. Buat Pengguna
            $pengguna = Pengguna::create([
                'username'   => $row['nim'],
                'password'   => ($row['nim']),
                'jenis_role' => 'mahasiswa',
            ]);

            // 2. Buat Mahasiswa
            Mahasiswa::create([
                'id_pengguna' => $pengguna->id_pengguna,
                'nim'         => $row['nim'],
                'nama'        => $row['nama'],
                'kelas'       => $row['kelas'] ?? '',
                'prodi'       => $row['prodi'] ?? '',
                'status'      => 'aktif',
            ]);
        }
    }
}
