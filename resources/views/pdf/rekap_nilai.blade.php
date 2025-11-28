<!DOCTYPE html>
<html>
<head>
    <title>Hasil Nilai OSCE</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        /* Header Judul */
        .page-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .divider {
            border-bottom: 2px solid #ccc;
            margin-bottom: 20px;
        }

        /* Profil Section */
        .profile-container {
            width: 100%;
            margin-bottom: 30px;
        }
        .profile-table td {
            vertical-align: top;
            padding: 5px;
        }
        .avatar-circle {
            width: 80px;
            height: 80px;
            background-color: #ddd;
            border-radius: 50%;
            display: inline-block; /* Dompdf support */
            text-align: center;
            line-height: 80px;
            font-weight: bold;
            color: #666;
            font-size: 24px;
        }

        /* Stase Card (Blue Header) */
        .stase-card {
            margin-bottom: 30px;
            width: 100%;
        }
        .stase-header {
            background-color: #63a4ff; /* Warna Biru sesuai gambar */
            color: white;
            padding: 15px 20px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            position: relative;
            height: 60px; /* Fixed height agar layout rapi */
        }
        .stase-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            margin-bottom: 5px;
        }
        .stase-penguji {
            font-size: 12px;
            opacity: 0.9;
        }
        
        /* Kotak Nilai Total di Kanan Atas */
        .total-box {
            position: absolute;
            top: 10px;
            right: 20px;
            background-color: white;
            color: #63a4ff;
            padding: 5px 15px;
            border-radius: 8px;
            text-align: center;
            width: 60px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .total-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            display: block;
        }
        .total-value {
            font-size: 24px;
            font-weight: bold;
            display: block;
        }

        /* Tabel Penilaian */
        .assessment-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px; /* Jarak antar baris seperti di gambar */
        }
        
        /* Header Abu-abu (Aspek) */
        .aspect-header {
            background-color: #c4c4c4; /* Warna Abu sesuai gambar */
            font-weight: bold;
            padding: 10px 15px;
            font-size: 12px;
            border: 1px solid #999;
            border-radius: 5px;
        }

        /* Baris Kompetensi (Rounded Border) */
        .row-item td {
            border: 1px solid #999;
            padding: 10px 15px;
            background-color: white;
            font-size: 12px;
        }
        /* Trik membuat border radius pada tabel row di PDF (workaround) */
        .row-item td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-right: none;
        }
        .row-item td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            border-left: 1px solid #999;
            text-align: center;
            font-weight: bold;
            width: 150px;
        }

        /* Baris Total Bawah */
        .row-total td {
            border: 1px solid #999;
            padding: 10px 15px;
            background-color: white;
            font-size: 12px;
            font-weight: bold;
        }
        .row-total td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            border-right: none;
            text-align: center;
        }
        .row-total td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            border-left: 1px solid #999;
            text-align: center;
        }

        /* Page Break Prevention */
        .stase-card {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>

    <div class="page-title">Hasil Nilai OSCE {{ $tahun }}</div>
    <div class="divider"></div>

    <div class="profile-container">
        <table class="profile-table" width="100%">
            <tr>
                <td width="100">
                    <div class="avatar-circle">
                        {{ substr($mahasiswa['nama'], 0, 1) }}
                    </div>
                </td>
                <td>
                    <table width="100%">
                        <tr>
                            <td style="font-weight: bold; width: 60px;">Nama</td>
                            <td style="width: 10px;">:</td>
                            <td>{{ $mahasiswa['nama'] }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">NIM</td>
                            <td>:</td>
                            <td>{{ $mahasiswa['nim'] }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Jurusan</td>
                            <td>:</td>
                            <td>Kedokteran Umum</td> 
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <div class="divider"></div>

    @foreach($nilai_per_stase as $stase)
    <div class="stase-card">
        <div class="stase-header">
            <div class="stase-title">{{ $stase['nama_stase'] }}</div>
            <div class="stase-penguji">Penguji : {{ $stase['nama_penguji'] }}</div>
            
            <div class="total-box">
                <span class="total-label">Total Nilai</span>
                <span class="total-value">{{ number_format($stase['nilai_akhir_stase'], 0) }}</span>
            </div>
        </div>

        <table class="assessment-table">
            @foreach($stase['aspek_penilaian'] as $index => $aspek)
                <tr>
                    <td colspan="2" class="aspect-header">
                        {{ chr(65 + $index) }}. {{ $aspek['aspek'] }} (Bobot Default)
                    </td>
                </tr>

                @php $subTotal = 0; @endphp
                @foreach($aspek['kompetensi'] as $komp)
                    @php 
                        $subTotal += $komp['nilai']; 
                        // Helper Predikat Sederhana
                        $predikat = match((int)$komp['skor']) {
                            3 => 'Sangat Baik',
                            2 => 'Baik',
                            1 => 'Cukup',
                            0 => 'Kurang',
                            default => '-'
                        };
                    @endphp
                    <tr class="row-item">
                        <td>{{ $komp['kompetensi'] }}</td>
                        <td>{{ $komp['skor'] }} ({{ $predikat }})</td>
                    </tr>
                @endforeach
                
                <tr class="row-total">
                    <td>Total</td>
                    <td>{{ $subTotal }}</td>
                </tr>
            @endforeach
        </table>
    </div>
    @endforeach

</body>
</html>