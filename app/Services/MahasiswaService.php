<?php

namespace App\Services;

use App\Imports\MahasiswaImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\UploadedFile;

class MahasiswaService
{
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
