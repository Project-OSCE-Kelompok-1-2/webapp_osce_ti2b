<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Laporan Hasil OSCE - {{ $mahasiswa['nim'] }}</title>
    <style>
        /* GLOBAL STYLES */
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            font-size: 11pt;
            /* Ukuran standar surat resmi */
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }

        /* UTILITIES */
        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-bold {
            font-weight: bold;
        }

        .uppercase {
            text-transform: uppercase;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        .mt-10 {
            margin-top: 10px;
        }

        /* HEADER SECTION */
        .header-container {
            border-bottom: 2px solid #2c3e50;
            /* Garis tebal di bawah header */
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header-table {
            width: 100%;
        }

        .title-text {
            font-size: 18pt;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
        }

        .subtitle-text {
            font-size: 10pt;
            color: #7f8c8d;
            margin: 5px 0 0 0;
        }

        /* STUDENT INFO & SCORE TABLE */
        .info-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
        }

        .info-label {
            width: 120px;
            color: #7f8c8d;
            font-size: 10pt;
        }

        .info-value {
            font-weight: bold;
            font-size: 11pt;
            color: #2c3e50;
        }

        /* KOTAK NILAI AKHIR (Clean Box) */
        .score-box {
            border: 2px solid #2c3e50;
            padding: 10px 20px;
            text-align: center;
            display: inline-block;
        }

        .score-label {
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #7f8c8d;
        }

        .score-val {
            font-size: 28pt;
            font-weight: 900;
            color: #2c3e50;
            line-height: 1;
            margin: 5px 0;
        }

        .score-year {
            font-size: 9pt;
            color: #95a5a6;
        }

        /* STASE SECTION */
        .stase-wrapper {
            margin-bottom: 30px;
            page-break-inside: avoid;
            /* Mencegah tabel terpotong */
        }

        .stase-header {
            background-color: #ecf0f1;
            /* Abu-abu muda */
            border-left: 5px solid #2c3e50;
            /* Aksen biru tua di kiri */
            padding: 10px 15px;
            margin-bottom: 10px;
        }

        .stase-name {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
        }

        .stase-examiner {
            font-size: 9pt;
            color: #7f8c8d;
            margin-top: 2px;
        }

        /* DATA TABLE STYLE */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
        }

        .data-table th {
            background-color: #2c3e50;
            color: #ffffff;
            padding: 8px;
            text-align: left;
            font-size: 9pt;
            text-transform: uppercase;
        }

        .data-table td {
            border-bottom: 1px solid #bdc3c7;
            padding: 8px;
            vertical-align: middle;
        }

        /* Kolom Spesifik */
        .col-skor {
            background-color: #f9f9f9;
            font-weight: bold;
            color: #333;
        }

        .col-nilai {
            background-color: #eaf2f8;
            /* Biru sangat muda */
            color: #2980b9;
            font-weight: bold;
        }

        .aspek-row {
            background-color: #f2f2f2;
        }

        .aspek-title {
            font-weight: bold;
            font-size: 9pt;
            text-transform: uppercase;
            color: #555;
        }

        /* Footer Table */
        .total-row td {
            border-top: 2px solid #2c3e50;
            background-color: #ffffff;
            padding: 12px 8px;
        }
    </style>
</head>

<body>

    <div class="header-container">
        <table class="header-table">
            <tr>
                <td width="65%" valign="top">
                    <h1 class="title-text">Laporan Hasil OSCE</h1>
                    <p class="subtitle-text">Detail penilaian berbasis kompetensi mahasiswa.</p>

                    <table class="info-table">
                        <tr>
                            <td class="info-label">Nama Mahasiswa</td>
                            <td class="info-value">: {{ $mahasiswa['nama'] ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td class="info-label">NIM</td>
                            <td class="info-value">: {{ $mahasiswa['nim'] ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Ujian</td>
                            <td class="info-value">: {{ $osce['nama_osce'] ?? 'Ujian OSCE' }}</td>
                        </tr>
                    </table>
                </td>

                <td width="35%" valign="top" align="right">
                    <div class="score-box">
                        <div class="score-label">Total Nilai Akhir</div>
                        <div class="score-val">{{ (float) number_format($nilai_total_osce ?? 0, 2) }}</div>
                        <div class="score-year">Tahun Akademik {{ $tahun }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    @if(count($nilai_per_stase) > 0)
    @foreach($nilai_per_stase as $index => $stase)
    <div class="stase-wrapper">

        <table width="100%" class="stase-header">
            <tr>
                <td>
                    <div class="stase-name">
                        {{ $index + 1 }}. {{ $stase['nama_stase'] }}
                    </div>
                    <div class="stase-examiner">
                        Penguji: <strong>{{ $stase['nama_penguji'] ?? '-' }}</strong>
                    </div>
                </td>
                <td align="right" valign="middle">
                    <span style="font-size: 9pt; color: #7f8c8d;">Nilai Stase:</span>
                    <span style="font-size: 14pt; font-weight: bold; color: #2c3e50; margin-left: 5px;">
                        {{ (float) number_format($stase['nilai_akhir_stase'] ?? 0, 2) }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="data-table">
            <thead>
                <tr>
                    <th width="5%" class="text-center">No</th>
                    <th width="55%">Aspek & Kompetensi</th>
                    <th width="10%" class="text-center">Skor</th>
                    <th width="10%" class="text-center">Bobot</th>
                    <th width="15%" class="text-center">Nilai</th>
                </tr>
            </thead>
            <tbody>
                @foreach(($stase['aspek_penilaian'] ?? []) as $aspek)
                <tr class="aspek-row">
                    <td colspan="5" class="aspek-title">
                        {{ $aspek['aspek'] }}
                    </td>
                </tr>

                @foreach(($aspek['kompetensi'] ?? []) as $kIndex => $komp)
                <tr>
                    <td class="text-center" style="color: #7f8c8d;">{{ $kIndex + 1 }}</td>
                    <td>{{ $komp['kompetensi'] }}</td>
                    <td class="text-center col-skor">{{ $komp['skor'] }}</td>
                    <td class="text-center">{{ $komp['bobot'] }}</td>
                    <td class="text-center col-nilai">
                        {{ number_format((float)($komp['nilai'] ?? 0), 0) }}
                    </td>
                </tr>
                @endforeach
                @endforeach

                <tr class="total-row">
                    <td colspan="3" class="text-right text-bold" style="color: #2c3e50;">
                        JUMLAH NILAI BOBOT
                    </td>
                    <td colspan="2" class="text-center text-bold" style="background-color: #2c3e50; color: #fff;">
                        {{ number_format((float)($stase['total_skor_bobot'] ?? 0), 0) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    @endforeach
    @else
    <div style="text-align: center; padding: 50px; border: 1px solid #ccc; background-color: #f9f9f9; color: #777;">
        <p>Data penilaian tidak tersedia.</p>
    </div>
    @endif

</body>

</html>