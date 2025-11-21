<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\OsceStase;
use App\Models\EnrollmentOsce;

class RekapController extends Controller
{
    /**
     * MODE EDIT → GET /penguji/osce/{id_osce}/stase/{id_osce_stase}/edit-nilai
     */
    public function editNilai(Request $request, $id_osce, $id_osce_stase)
    {
        return $this->getData($id_osce, $id_osce_stase, 'edit');
    }

    /**
     * MODE REKAP → GET /penguji/osce/{id_osce}/stase/{id_osce_stase}/rekap
     */
    public function rekap(Request $request, $id_osce, $id_osce_stase)
    {
        return $this->getData($id_osce, $id_osce_stase, 'rekap');
    }

    /**
     * Private function untuk logic reusable (DRY Pattern)
     */
    private function getData($id_osce, $id_osce_stase, $mode)
    {
        $user = Auth::user();
        
        // 1. Validasi Akses Penguji & Ambil Data Stase
        // Kita butuh 'id_stase' untuk filter nilai yang benar
        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        // 2. Ambil List Mahasiswa & Total Nilai PER STASE INI
        // Logic: Ambil enrollment di OSCE ini, lalu hitung SUM nilai 
        // TAPI hanya nilai yang poin penilaiannya milik stase ini.
        
        $idStase = $osceStase->id_stase;

        $mahasiswa_list = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                // Subquery hitung total nilai KHUSUS stase ini
                DB::raw("(
                    SELECT SUM(no.nilai * pap.bobot) -- Asumsi nilai dikali bobot, atau sesuaikan logic
                    FROM nilai_osce AS no
                    JOIN poin_aspek_penilaian AS pap ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                    JOIN aspek_penilaian AS ap ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                    WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                    AND ap.id_stase = {$idStase} 
                ) as nilai_total")
            ])
            ->get()
            // Filter di PHP (Opsional): Jika ingin hanya menampilkan mahasiswa yang sudah dinilai
            // ->filter(fn($m) => $m->nilai_total !== null) 
            ->values();

        // 3. Format Data untuk UI
        // Kita perlu kirim osce_detail agar header di frontend muncul
        $osce_detail = [
            'nama_osce' => $osceStase->osce->nama_osce,
            'nama_stase' => $osceStase->stase->nama_stase,
            'waktu_per_rubrik' => $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa' => $mahasiswa_list->count(),
            'nama_penguji' => $user->penguji->nama,
        ];

        // 4. Tentukan View berdasarkan mode
        $view = $mode === 'edit' ? 'Penguji/EditNilaiForm' : 'Penguji/RekapMahasiswaPage';

        return Inertia::render($view, [
            'osce_detail' => $osce_detail,
            'mahasiswa_list' => $mahasiswa_list
        ]);
    }
}