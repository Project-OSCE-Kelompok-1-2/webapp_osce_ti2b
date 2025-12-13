<?php

namespace App\Services\Admin;

use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Imports\MahasiswaImport;
use App\Models\Enrollment;
use App\Models\TahunAkademik;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;

class MahasiswaService
{
    /**
     * Mengambil daftar mahasiswa dengan filter dan paginasi.
     */
    public function getAll($search = null, $angkatan = null)
{
    // 1. Tambahkan 'with' agar query lebih ringan (Eager Loading)
    $mahasiswaQuery = Mahasiswa::query()->with(['enrollment.tahunAkademik']);

    // ... (Logic Filter Search & Angkatan BIARKAN SAMA SEPERTI SEBELUMNYA) ...
    $mahasiswaQuery->when($search, function ($query, $search) {
        $query->where(function ($q) use ($search) {
            $q->where('nim', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        });
    });

    if ($angkatan && $angkatan !== 'SEMUA') {
        $mahasiswaQuery->whereHas('enrollment', function ($qEnroll) use ($angkatan) {
            $qEnroll->whereHas('tahunAkademik', function ($qTahun) use ($angkatan) {
                $qTahun->where('tahun', $angkatan);
            });
        });
    }
    // ... (Akhir Logic Filter) ...

    $mahasiswa = $mahasiswaQuery
        ->orderBy('nama', 'asc')
        ->paginate(10)
        ->withQueryString()
        ->through(fn($mhs) => [
            'id_mahasiswa' => $mhs->id_mahasiswa,
            'nim' => $mhs->nim,
            'nama' => $mhs->nama,
            'kelas' => $mhs->kelas, // Ini mengambil data dari kolom kelas
            'prodi' => $mhs->prodi,
            
            // [PERBAIKAN UTAMA ADA DISINI]
            // Ambil tahun dari tabel enrollment -> tahun_akademik
            'angkatan' => $mhs->enrollment->first()?->tahunAkademik?->tahun ?? "",
        ]);

    return $mahasiswa;
}

    /**
     * Logika validasi dan penyimpanan mahasiswa baru (Transaction).
     */
    public function store($validated)
{
    return DB::transaction(function () use ($validated) {
        // 1. Buat User
        $pengguna = Pengguna::create([
            'username' => $validated['nim'],
            'password' => bcrypt($validated['nim']),
            'jenis_role' => 'mahasiswa',
        ]);

        // 2. Buat Mahasiswa (Simpan Kelas A/B/C)
        $mahasiswa = Mahasiswa::create([
            'id_pengguna' => $pengguna->id_pengguna,
            'nim'   => $validated['nim'],
            'nama'  => $validated['nama'],
            'kelas' => $validated['kelas'], // Ini sekarang menyimpan "A", "B", dst.
            'prodi' => $validated['prodi'],
            'status' => 'aktif',
        ]);

        // 3. LOGIKA ENROLLMENT (PERBAIKAN DI SINI)
        // Gunakan 'angkatan' (2025/2026), JANGAN 'kelas'
        $tahunString = $validated['angkatan']; 
        
        $tahunAkademik = TahunAkademik::where('tahun', $tahunString)->first();

        if ($tahunAkademik) {
            Enrollment::create([
                'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                'id_tahun_akademik' => $tahunAkademik->id_tahun_akademik,
                'tanggal_daftar' => now(),
            ]);
        }

        return $mahasiswa;
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
    return DB::transaction(function () use ($validated, $mahasiswa) {
        // 1. Update Data Mahasiswa
        $mahasiswa->update([
            'nim'   => $validated['nim'],
            'nama'  => $validated['nama'],
            'kelas' => $validated['kelas'],
            'prodi' => $validated['prodi'],
        ]);

        // 2. Update Username (jika perlu)
        if ($mahasiswa->pengguna) {
            $mahasiswa->pengguna->update(['username' => $validated['nim']]);
        }

        // 3. [BARU] Update Enrollment (Pindah Angkatan)
        if (isset($validated['angkatan'])) {
            $tahunBaru = TahunAkademik::where('tahun', $validated['angkatan'])->first();

            if ($tahunBaru) {
                // Cek enrollment lama
                $enrollment = $mahasiswa->enrollment()->first();

                if ($enrollment) {
                    // Update enrollment yang ada
                    $enrollment->update([
                        'id_tahun_akademik' => $tahunBaru->id_tahun_akademik
                    ]);
                } else {
                    // Jika belum punya enrollment (kasus data lama rusak), buat baru
                    Enrollment::create([
                        'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                        'id_tahun_akademik' => $tahunBaru->id_tahun_akademik,
                        'tanggal_daftar' => now(),
                    ]);
                }
            }
        }

        return $mahasiswa->refresh();
    });
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
