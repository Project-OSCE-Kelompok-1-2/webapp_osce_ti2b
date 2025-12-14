<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

// Library Export
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\RekapNilaiExport; // Kita akan buat file ini di Langkah 2

use App\Models\OsceStase;
use App\Models\EnrollmentOsce;

class RekapController extends Controller
{
    // --- 1. HALAMAN VIEW WEB ---
    public function rekap(Request $request, $id_osce, $id_osce_stase)
    {
        // Panggil fungsi reusable untuk ambil data

        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $request->query('search'));
        return Inertia::render('Penguji/RekapMahasiswaPage', [
            'osce_detail'    => $data['osce_detail'],
            'mahasiswa_list' => $data['mahasiswa_list']
        ]);
    }



    public function editNilai(Request $request, $id_osce, $id_osce_stase)
    {
        // Edit nilai biasanya spesifik per mahasiswa, tapi jika menggunakan list yang sama:
        $data = $this->fetchDataCommon($id_osce, $id_osce_stase);

        return Inertia::render('Penguji/EditNilaiForm', [
            'osce_detail'    => $data['osce_detail'],
            'mahasiswa_list' => $data['mahasiswa_list']
        ]);
    }

    public function exportExcel(Request $request, $id_osce, $id_osce_stase)
    {
        $search = $request->query('search');

        // Ambil data mahasiswa & detail OSCE
        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $search);

        // [PERBAIKAN NAMA FILE]: Pastikan nama file tidak mengandung karakter ilegal (seperti / atau \).
        $rawOsceName = $data['osce_detail']['nama_osce'] ?? 'OSCE';
        // Ganti karakter non-alphanumeric (kecuali spasi, underscore, dan dash) dengan underscore.
        $safeOsceName = preg_replace('/[^A-Za-z0-9\s\-_]/', '_', $rawOsceName);
        $fileName = 'Rekap_Nilai_' . str_replace(' ', '_', $safeOsceName) . '.xlsx';

        // Download menggunakan Class Export
        return Excel::download(new RekapNilaiExport($data['mahasiswa_list'], $data['osce_detail']), $fileName);
    }

    // --- 3. FUNGSI EXPORT PDF ---
    public function exportPdf(Request $request, $id_osce, $id_osce_stase)
    {
        $search = $request->query('search');

        // Ambil data lengkap
        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $search);

        // [PERBAIKAN NAMA FILE]: Pastikan nama file tidak mengandung karakter ilegal.
        $rawOsceName = $data['osce_detail']['nama_osce'] ?? 'OSCE';
        $safeOsceName = preg_replace('/[^A-Za-z0-9\s\-_]/', '_', $rawOsceName);
        $fileName = 'Rekap_Nilai_' . str_replace(' ', '_', $safeOsceName) . '.pdf';

        // Load View Blade untuk PDF
        $pdf = Pdf::loadView('pdf.rekap_nilai_penguji', [ // Menggunakan nama view yang disarankan
            'mahasiswa' => $data['mahasiswa_list'],
            'osce'      => $data['osce_detail']
        ]);

        return $pdf->download($fileName);
    }

    // --- 4. HELPER: Validasi & Ambil Info Stase ---
    private function getOsceStaseOrAbort($id_osce, $id_osce_stase)
    {
        $user = Auth::user();

        if (!$user->penguji) {
            abort(403, 'Akun Anda tidak memiliki profil Penguji.');
        }

        return OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();
    }

    // --- 5. CORE LOGIC: Query Data (Reusable) ---
    // --- 5. CORE LOGIC: Query Data (Reusable) ---
    private function fetchDataCommon($id_osce, $id_osce_stase, $search = null)
    {
        // A. Validasi & Ambil Data Sesi Spesifik
        $osceStase = OsceStase::with(['stase', 'osce', 'penguji'])
            ->where('id_osce', $id_osce)
            ->findOrFail($id_osce_stase);

        $idStase = $osceStase->id_stase;

        // --- PERBAIKAN UTAMA DI SINI ---
        // 1. Simpan parameter waktu sesi ini untuk pencocokan
        // Kita gunakan format Y-m-d dan H:i (05 karakter) agar sesuai logika index
        $targetTanggal = $osceStase->tanggal->format('Y-m-d');
        $targetJam     = substr($osceStase->jam_mulai, 0, 5);

        // B. Query Awal Mahasiswa (Masih ambil semua + Search)
        $query = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                // Subquery Nilai Total tetap dipertahankan
                DB::raw("(
                SELECT SUM(no.nilai * pap.bobot) 
                FROM nilai_osce AS no
                JOIN poin_aspek_penilaian AS pap ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                JOIN aspek_penilaian AS ap ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                AND ap.id_stase = $idStase 
            ) as nilai_total")
            ]);

        // C. Filter Search (Query Database)
        if ($search) {
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%{$search}%")
                    ->orWhere('nim', 'LIKE', "%{$search}%");
            });
        }

        // Ambil data dari database (Masih tercampur semua jam)
        $mahasiswaRaw = $query->get();

        // D. FILTERING PHP (Logika Sukses dari Halaman Index)
        // Kita filter collection hasil query agar HANYA menyisakan mahasiswa
        // yang tanggal_sesi & jam_sesi nya cocok dengan OsceStase ini.
        $mahasiswaFiltered = $mahasiswaRaw->filter(function ($enrollment) use ($targetTanggal, $targetJam) {
            // Parsing tanggal sesi mahasiswa
            // Pastikan field 'tanggal_sesi' dan 'jam_sesi' ada di tabel enrollment_osce Anda
            $mhsTanggal = \Carbon\Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
            $mhsJam     = substr((string) $enrollment->jam_sesi, 0, 5);

            // Logika Pencocokan Mutlak
            return $mhsTanggal === $targetTanggal && $mhsJam === $targetJam;
        });

        // E. Formatting Data List Mahasiswa (Mapping dari hasil Filter)
        // Gunakan ->values() untuk mereset index array (0, 1, 2...) agar JSON rapi
        $mahasiswaList = $mahasiswaFiltered->map(function ($item) {
            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'        => $item->mahasiswa->nama ?? '-',
                'nim'         => $item->mahasiswa->nim ?? '-',
                'prodi'       => $item->mahasiswa->prodi ?? '-',
                // rumus nilai total dibagi 4
                'nilai_total' => $item->nilai_total ? round((float)$item->nilai_total, 2) / 4 : 0,
            ];
        })->values();

        // F. Format Header
        $osce_detail = [
            'id_osce'       => $id_osce,
            'id_osce_stase' => $id_osce_stase,
            'nama_osce'     => $osceStase->osce->nama_osce,
            'nama_stase'    => $osceStase->stase->nama_stase,
            'nama_penguji'  => $osceStase->penguji->nama,
            'tanggal'       => $osceStase->tanggal->translatedFormat('d F Y'), // Biar format Indonesia bagus
            'jam_mulai'     => $osceStase->jam_mulai,
            'jam_selesai'   => $osceStase->jam_selesai,
            'sesi_label'    => \Carbon\Carbon::parse($osceStase->jam_mulai)->format('H:i') . ' - ' . \Carbon\Carbon::parse($osceStase->jam_selesai)->format('H:i'),
            'durasi_per_mahasiswa' => $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa'      => $mahasiswaList->count(), // Hitung dari list yang sudah difilter
        ];

        return [
            'osce_detail'    => $osce_detail,
            'mahasiswa_list' => $mahasiswaList
        ];
    }
}
