<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class TemplateMahasiswaExport implements WithHeadings, WithColumnWidths, FromArray, WithStyles
{
    /**
     * Menentukan lebar spesifik per kolom
     * Satuan kira-kira setara dengan jumlah karakter.
     */
    public function columnWidths(): array
    {
        return [
            'A' => 25, // Kolom NIM 
            'B' => 50, // Kolom NAMA
            'C' => 25, // Kolom KELAS
            'D' => 40, // Kolom PRODI
        ];
    }

    public function headings(): array
    {
        return [
            // Baris 1: Instruksi (Merge A-D)
            ['PERHATIAN: 2 Baris data di bawah ini adalah CONTOH. Silakan dihapus atau ditimpa. JANGAN ubah baris Header ini.'],

            // Baris 2: Header Kolom
            ['NIM', 'NAMA', 'KELAS', 'PRODI'],
        ];
    }

    public function array(): array
    {
        return [
            [
                '2023001',
                'Budi Santoso (Contoh)',
                '2023/2024',
                'S1 Keperawatan',
            ],
            [
                '2023002',
                'Siti Aminah (Contoh)',
                '2023/2024',
                'D3 Kebidanan',
            ],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // 1. Merge Cells untuk Instruksi
        $sheet->mergeCells('A1:D1');

        // 2. Styling Baris Instruksi
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FFFF0000'], // Merah
                'italic' => true,
                'size' => 11,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Atur tinggi baris instruksi
        $sheet->getRowDimension('1')->setRowHeight(30);

        // 3. Styling Header Kolom (Baris 2)
        $sheet->getStyle('A2:D2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFEFEFEF'], // Abu-abu muda
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Atur tinggi baris header kolom
        $sheet->getRowDimension('2')->setRowHeight(25);

        // 4. Border untuk seluruh tabel
        $highestRow = $sheet->getHighestRow();
        $sheet->getStyle('A2:D' . $highestRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER, // Isi data di tengah secara vertikal
            ],
        ]);

        // Kolom NIM & Kelas rata tengah
        $sheet->getStyle('A3:A' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C3:C' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    }
}
