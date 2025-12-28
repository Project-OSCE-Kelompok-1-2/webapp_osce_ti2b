<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use App\Models\Enrollment;    
use App\Models\TahunAkademik;  
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\DB; 

class MahasiswaImport implements ToCollection, WithHeadingRow
{
    public function headingRow(): int
    {
        return 2;
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            if (!isset($row['nim']) || !isset($row['nama'])) {
                continue;
            }

            if (Mahasiswa::where('nim', $row['nim'])->exists()) {
                continue;
            }

            DB::transaction(function () use ($row) {

                $angkatanString = $row['angkatan'] ?? date('Y') . '/' . (date('Y') + 1); 

                $tahunAkademik = TahunAkademik::firstOrCreate(
                    ['tahun' => $angkatanString], 
                    [
                        'semester' => 'Ganjil',
                        'status' => 'non-aktif'
                    ]
                );

                $pengguna = Pengguna::create([
                    'username'   => $row['nim'],
                    'password'   => $row['nim'], 
                    'jenis_role' => 'mahasiswa',
                ]);

                $mahasiswa = Mahasiswa::create([
                    'id_pengguna' => $pengguna->id_pengguna,
                    'nim'         => $row['nim'],
                    'nama'        => $row['nama'],
                    'kelas'       => $row['kelas'] ?? '',
                    'prodi'       => $row['prodi'] ?? '',
                    'status'      => 'aktif',
                ]);

                Enrollment::create([
                    'id_mahasiswa'      => $mahasiswa->id_mahasiswa,
                    'id_tahun_akademik' => $tahunAkademik->id_tahun_akademik,
                    'tanggal_daftar'    => now(),
                ]);
            });
        }
    }
}
