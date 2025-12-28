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
        $mahasiswaQuery = Mahasiswa::query()->with(['enrollment.tahunAkademik']);

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

        $mahasiswa = $mahasiswaQuery
            ->orderBy('nama', 'asc')
            ->get() 
            ->map(fn($mhs) => [ 
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                'kelas' => $mhs->kelas,
                'prodi' => $mhs->prodi,
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
        $pengguna = Pengguna::create([
            'username' => $validated['nim'],
            'password' => bcrypt($validated['nim']),
            'jenis_role' => 'mahasiswa',
        ]);

        $mahasiswa = Mahasiswa::create([
            'id_pengguna' => $pengguna->id_pengguna,
            'nim'   => $validated['nim'],
            'nama'  => $validated['nama'],
            'kelas' => $validated['kelas'],
            'prodi' => $validated['prodi'],
            'status' => 'aktif',
        ]);

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
        $mahasiswa->update([
            'nim'   => $validated['nim'],
            'nama'  => $validated['nama'],
            'kelas' => $validated['kelas'],
            'prodi' => $validated['prodi'],
        ]);

        if ($mahasiswa->pengguna) {
            $mahasiswa->pengguna->update(['username' => $validated['nim']]);
        }

        if (isset($validated['angkatan'])) {
            $tahunBaru = TahunAkademik::where('tahun', $validated['angkatan'])->first();

            if ($tahunBaru) {
                $enrollment = $mahasiswa->enrollment()->first();

                if ($enrollment) {
                    $enrollment->update([
                        'id_tahun_akademik' => $tahunBaru->id_tahun_akademik
                    ]);
                } else {
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
            if ($mahasiswa->pengguna) {
                $mahasiswa->pengguna->delete();
            }
            return $mahasiswa->delete();
        });
    }
    /** 
     * @param UploadedFile $file
     * @return void
     * @throws \Exception
     */
    public function importMahasiswa(UploadedFile $file)
    {
        Excel::import(new MahasiswaImport, $file);
    }
}
