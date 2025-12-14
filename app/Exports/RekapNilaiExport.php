<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapNilaiExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $mahasiswa;
    protected $osceDetail;

    public function __construct($mahasiswa, $osceDetail)
    {
        $this->mahasiswa = $mahasiswa;
        $this->osceDetail = $osceDetail;
    }

    public function collection()
    {
        return $this->mahasiswa;
    }

    public function map($row): array
    {
        return [
            $row['nama'],
            $row['nim'],
            $row['nilai_total'] == 0 ? '0 (Belum Dinilai)' : $row['nilai_total'],
        ];
    }

    public function headings(): array
    {
        return [
            ['REKAP NILAI OSCE: ' . $this->osceDetail['nama_osce']],
            ['STASE: ' . $this->osceDetail['nama_stase']],
            ['PENGUJI: ' . $this->osceDetail['nama_penguji']],
            [''], // Spasi kosong
            ['Nama Mahasiswa', 'NIM', 'Nilai Total'] // Header Tabel
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            5    => ['font' => ['bold' => true]], // Bold baris header tabel
            1    => ['font' => ['bold' => true, 'size' => 14]], // Judul Utama
        ];
    }
}