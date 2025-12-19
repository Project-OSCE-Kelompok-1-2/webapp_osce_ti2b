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
     */
    public function columnWidths(): array
    {
        return [
            'A' => 25, // Kolom NIM 
            'B' => 50, // Kolom NAMA
            'C' => 25, // Kolom KELAS
            'D' => 40, // Kolom PRODI
            'E' => 15, // Kolom ANGKATAN
        ];
    }

    public function headings(): array
    {
        return [
            ['PERHATIAN: 2 Baris data di bawah ini adalah CONTOH. Silakan dihapus atau ditimpa. JANGAN ubah baris Header ini.'],

            ['NIM', 'NAMA', 'KELAS', 'PRODI', 'ANGKATAN'], 
        ];
    }

    public function array(): array
    {
        return [
            [
                '2023001',
                'Budi Santoso (Contoh)',
                'A',
                'D3 Teknik Informatika',
                '2023', 
            ],
            [
                '2023002',
                'Siti Aminah (Contoh)',
                'B',
                'D3 Teknik Mesin',
                '2023', 
            ],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:E1');

        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FFFF0000'], 
                'italic' => true,
                'size' => 11,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getRowDimension('1')->setRowHeight(30);

        $sheet->getStyle('A2:E2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFEFEFEF'], 
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getRowDimension('2')->setRowHeight(25);

        $highestRow = $sheet->getHighestRow();
        $sheet->getStyle('A2:E' . $highestRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getStyle('A3:A' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C3:C' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E3:E' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    }
}
