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
    public function editNilai(Request $request, $id_osce, $id_osce_stase)
    {
        return $this->getData($id_osce, $id_osce_stase, 'edit');
    }

    public function rekap(Request $request, $id_osce, $id_osce_stase)
    {
        return $this->getData($id_osce, $id_osce_stase, 'rekap');
    }

    private function getData($id_osce, $id_osce_stase, $mode)
    {
        $user = Auth::user();

        // [FIX 1] Validasi User & Relasi Penguji
        if (!$user->penguji) {
            abort(403, 'Akun Anda tidak memiliki profil Penguji.');
        }

        // 1. Validasi Akses & Ambil Data Stase
        // Pastikan penguji yang login memang ditugaskan di stase ini
        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        // [FIX 2] Cast ID ke integer. Ini KUNCI perbaikan agar aman masuk ke string SQL
        $idStase = (int) $osceStase->id_stase;

        // 2. Query Data Mahasiswa & Hitung Nilai via Subquery
        $mahasiswaRaw = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                // [FIX 3] Interpolasi variabel $idStase langsung ke string SQL
                // Kita HAPUS tanda '?' dan setBindings() untuk menghindari bentrok parameter
                DB::raw("(
                    SELECT SUM(no.nilai * pap.bobot) 
                    FROM nilai_osce AS no
                    JOIN poin_aspek_penilaian AS pap ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                    JOIN aspek_penilaian AS ap ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                    WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                    AND ap.id_stase = $idStase 
                ) as nilai_total")
            ])
            ->get();

        // 3. Mapping Data untuk Frontend
        $mahasiswaList = $mahasiswaRaw->map(function ($item) {
            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'        => $item->mahasiswa->nama ?? '-',
                'nim'         => $item->mahasiswa->nim ?? '-',
                // Format nilai: jika null jadi 0, jika ada dibulatkan 2 desimal
                'nilai_total' => $item->nilai_total ? round((float)$item->nilai_total, 2) : 0,
            ];
        });

        // 4. Format Header Data
        $osce_detail = [
            'id_osce'          => $id_osce,
            'id_osce_stase'    => $id_osce_stase,
            'nama_osce'        => $osceStase->osce->nama_osce,
            'nama_stase'       => $osceStase->stase->nama_stase,
            'durasi_per_mahasiswa' => $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa'  => $mahasiswaList->count(),
            'nama_penguji'     => $user->penguji->nama,
        ];

        // Tentukan View berdasarkan mode request
        $view = $mode === 'edit' ? 'Penguji/EditNilaiForm' : 'Penguji/SubmitRubrik';
        return Inertia::render($view, [
            'osce_detail'    => $osce_detail,
            'mahasiswa_list' => $mahasiswaList
        ]);
    }
}
