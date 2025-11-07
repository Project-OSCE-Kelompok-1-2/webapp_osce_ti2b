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
     * @param Collection $rows
     * Format header Excel:
     * nim | nama | kelas | prodi
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            if (!isset($row['nim']) || !isset($row['nama'])) continue;

            // Cegah duplikasi NIM
            if (Mahasiswa::where('nim', $row['nim'])->exists()) {
                continue;
            }

            // Buat pengguna
            $pengguna = Pengguna::create([
                'username'   => $row['nim'],
                'password'   => Hash::make($row['nim']),
                'jenis_role' => 'mahasiswa',
            ]);

            // Buat mahasiswa
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
