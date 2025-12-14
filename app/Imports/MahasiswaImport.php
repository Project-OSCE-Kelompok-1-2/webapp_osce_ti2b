<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Pengguna;
use App\Models\Enrollment;     // Tambahkan Model Enrollment
use App\Models\TahunAkademik;  // Tambahkan Model TahunAkademik
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\DB; // Gunakan DB Transaction agar aman

class MahasiswaImport implements ToCollection, WithHeadingRow
{
    /**
     * Menentukan posisi baris Header (Baris 2).
     */
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
            // 1. Validasi Dasar
            if (!isset($row['nim']) || !isset($row['nama'])) {
                continue;
            }

            // Cegah duplikasi NIM jika mahasiswa sudah ada
            if (Mahasiswa::where('nim', $row['nim'])->exists()) {
                continue;
            }

            // Gunakan Transaction agar jika Enrollment gagal, Mahasiswa tidak terbuat
            DB::transaction(function () use ($row) {

                // --- A. LOGIK TAHUN AKADEMIK (ANGKATAN) ---
                // Kita cari ID Tahun Akademik berdasarkan string di Excel (misal: "2023/2024")
                // Jika tidak ada, kita buat baru (FirstOrCreate)
                $angkatanString = $row['angkatan'] ?? date('Y') . '/' . (date('Y') + 1); // Default tahun sekarang jika kosong

                $tahunAkademik = TahunAkademik::firstOrCreate(
                    ['tahun' => $angkatanString], // Kunci pencarian
                    [
                        // Data default jika membuat baru
                        'semester' => 'Ganjil',
                        'status' => 'non-aktif'
                    ]
                );

                // --- B. BUAT PENGGUNA ---
                $pengguna = Pengguna::create([
                    'username'   => $row['nim'],
                    'password'   => $row['nim'], // Sebaiknya di-hash: Hash::make($row['nim'])
                    'jenis_role' => 'mahasiswa',
                ]);

                // --- C. BUAT MAHASISWA ---
                $mahasiswa = Mahasiswa::create([
                    'id_pengguna' => $pengguna->id_pengguna,
                    'nim'         => $row['nim'],
                    'nama'        => $row['nama'],
                    'kelas'       => $row['kelas'] ?? '',
                    'prodi'       => $row['prodi'] ?? '',
                    // 'angkatan' => dihapus karena tidak disimpan di tabel mahasiswa langsung
                    'status'      => 'aktif',
                ]);

                // --- D. BUAT ENROLLMENT (SOLUSI BUG) ---
                // Ini yang menghubungkan Mahasiswa dengan Tahun Akademik (Angkatan)
                Enrollment::create([
                    'id_mahasiswa'      => $mahasiswa->id_mahasiswa,
                    'id_tahun_akademik' => $tahunAkademik->id_tahun_akademik,
                    'tanggal_daftar'    => now(),
                ]);
            });
        }
    }
}
