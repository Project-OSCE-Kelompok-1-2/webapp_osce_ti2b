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
    private function fetchDataCommon($id_osce, $id_osce_stase, $search = null)
    {
        // A. Validasi & Info Stase
        $osceStase = $this->getOsceStaseOrAbort($id_osce, $id_osce_stase);
        $idStase   = (int) $osceStase->id_stase;

        // B. Query Mahasiswa & Nilai
        $query = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                // Subquery Nilai (Sesuai kode asli Anda)
                DB::raw("(
                    SELECT SUM(no.nilai * pap.bobot) 
                    FROM nilai_osce AS no
                    JOIN poin_aspek_penilaian AS pap ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                    JOIN aspek_penilaian AS ap ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                    WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                    AND ap.id_stase = $idStase 
                ) as nilai_total")
            ]);

        // C. Filter Search (Jika ada parameter search dari request)
        if ($search) {
            $query->whereHas('mahasiswa', function($q) use ($search) {
                $q->where('nama', 'LIKE', "%{$search}%")
                  ->orWhere('nim', 'LIKE', "%{$search}%");
            });
        }

        $mahasiswaRaw = $query->get();

        // D. Formatting Data
        $mahasiswaList = $mahasiswaRaw->map(function ($item) {
            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'        => $item->mahasiswa->nama ?? '-',
                'nim'         => $item->mahasiswa->nim ?? '-',
                
                // [PERBAIKAN] Cek apakah null secara spesifik.
                // Jika tidak null (termasuk 0), format angkanya. Jika null, biarkan null.
                'nilai_total' => $item->nilai_total !== null ? round((float)$item->nilai_total, 2) : null,
            ];
        });

        // E. Format Header
        $osce_detail = [
            'id_osce'              => $id_osce,
            'id_osce_stase'        => $id_osce_stase,
            'nama_osce'            => $osceStase->osce->nama_osce,
            'nama_stase'           => $osceStase->stase->nama_stase,
            'durasi_per_mahasiswa' => $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa'      => $mahasiswaList->count(),
            'nama_penguji'         => Auth::user()->penguji->nama,
        ];

        return [
            'osce_detail'    => $osce_detail,
            'mahasiswa_list' => $mahasiswaList
        ];
    }
}