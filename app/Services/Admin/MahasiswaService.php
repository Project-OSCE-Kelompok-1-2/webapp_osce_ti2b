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
    public function getAll($search = null, $angkatan = null, $tanggal_mulai = null, $tanggal_selesai = null)
    {
        // 1. Inisialisasi query Mahasiswa
        $mahasiswaQuery = Mahasiswa::query();

        // 2. Filter berdasarkan NIM atau Nama ($search)
        $mahasiswaQuery->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        });

        // 3. Filter berdasarkan Angkatan/Tahun Akademik ($angkatan) dan Tanggal
        if ($angkatan) {
            // Cari Tahun Akademik berdasarkan tahun angkatan
            $tahun_akademik = TahunAkademik::where("tahun", $angkatan)->first();

            if ($tahun_akademik) {
                // A. Filter Mahasiswa berdasarkan Enrollment dari Tahun Akademik
                // Kita mendapatkan semua ID Mahasiswa yang terdaftar (enrolled) pada Tahun Akademik ini
                $enrolled_mahasiswa_ids = $tahun_akademik->enrollment()
                    ->pluck('id_mahasiswa');

                $mahasiswaQuery->whereIn('id_mahasiswa', $enrolled_mahasiswa_ids);

                // B. Filter berdasarkan Rentang Tanggal yang dikirimkan
                // Asumsi model TahunAkademik memiliki kolom 'tanggal_mulai' dan 'tanggal_selesai'
                // Kita perlu mengambil data mahasiswa berdasarkan tanggal yang dikirim dari kueri parameter.
                // Jika filter tanggal berlaku, kita perlu memastikan hanya mahasiswa yang terdaftar 
                // di tahun akademik yang tanggalnya cocok yang terpilih.

                if ($tanggal_mulai && $tanggal_selesai) {
                    // Di sini Anda perlu menentukan logika tanggal. Jika tanggalnya merujuk ke field di TahunAkademik, 
                    // maka filter ini agak redundant karena $tahun_akademik sudah spesifik.
                    // Jika $tanggal_mulai dan $tanggal_selesai merujuk pada tanggal pendaftaran (di tabel Enrollment), 
                    // maka filter harus diterapkan pada tabel Enrollment.

                    // Opsi 1: Filter Mahasiswa yang terdaftar (Enrollment) pada Tahun Akademik DAN Tanggal tertentu
                    $enrollment_filtered_ids = $tahun_akademik->enrollment()
                        ->whereBetween('tanggal_pendaftaran', [$tanggal_mulai, $tanggal_selesai])
                        ->pluck('id_mahasiswa');

                    // Gabungkan filter ID Mahasiswa yang sudah ada dengan ID Mahasiswa yang difilter tanggal
                    $mahasiswaQuery->whereIn('id_mahasiswa', $enrollment_filtered_ids);

                    // Catatan: Jika Anda tidak punya kolom 'tanggal_pendaftaran' di tabel Enrollment, 
                    // Anda mungkin perlu menyesuaikan di mana tanggal tersebut disimpan.
                }
            } else {
                // Jika Tahun Akademik tidak ditemukan, kembalikan hasil kosong agar tidak memuat semua mahasiswa.
                $mahasiswaQuery->whereRaw('1 = 0'); // Trik untuk menghasilkan set hasil kosong
            }
        }

        // 4. Eksekusi Query dan Pagination
        $mahasiswa = $mahasiswaQuery
            ->orderBy('id_mahasiswa', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                'kelas' => $mhs->kelas, // Asumsi 'kelas' adalah field di tabel Mahasiswa
                'prodi' => $mhs->prodi, // Asumsi 'prodi' adalah field di tabel Mahasiswa
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
