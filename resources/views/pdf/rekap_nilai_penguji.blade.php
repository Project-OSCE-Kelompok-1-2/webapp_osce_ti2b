<!DOCTYPE html>
<html>
<head>
    <title>Rekap Nilai</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .meta { margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #333; }
        th { background-color: #f2f2f2; padding: 8px; }
        td { padding: 6px; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h2>REKAP NILAI OSCE</h2>
        <h3>{{ $osce['nama_osce'] }}</h3>
    </div>

    <div class="meta">
        <table>
            <tr>
                <td style="border:none; width: 150px;"><strong>Stase</strong></td>
                <td style="border:none;">: {{ $osce['nama_stase'] }}</td>
            </tr>
            <tr>
                <td style="border:none;"><strong>Penguji</strong></td>
                <td style="border:none;">: {{ $osce['nama_penguji'] }}</td>
            </tr>
            <tr>
                <td style="border:none;"><strong>Total Mahasiswa</strong></td>
                <td style="border:none;">: {{ $osce['total_mahasiswa'] }}</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th>Nama Mahasiswa</th>
                <th width="20%">NIM</th>
                <th width="15%">Nilai Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($mahasiswa as $index => $mhs)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $mhs['nama'] }}</td>
                <td class="text-center">{{ $mhs['nim'] }}</td>
                <td class="text-center">
                    {{ $mhs['nilai_total'] == 0 ? '-' : $mhs['nilai_total'] }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" class="text-center">Tidak ada data mahasiswa</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>