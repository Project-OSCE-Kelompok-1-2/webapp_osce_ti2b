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

        if (!$user->penguji) {
            abort(403, 'Akun Anda tidak memiliki profil Penguji.');
        }

        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        $idStase = (int) $osceStase->id_stase;

        // --- Ambil mahasiswa + nilai ---
        $mahasiswaRaw = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                DB::raw("
                    (
                        SELECT SUM(no.nilai * pap.bobot)
                        FROM nilai_osce AS no
                        JOIN poin_aspek_penilaian AS pap 
                            ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                        JOIN aspek_penilaian AS ap 
                            ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                        WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                        AND ap.id_stase = $idStase
                    ) AS nilai_total
                ")
            ])
            ->get();

        // --- Mapping untuk frontend ---
        $mahasiswaList = $mahasiswaRaw->map(function ($item) {
            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'               => $item->mahasiswa->nama ?? '-',
                'nim'                => $item->mahasiswa->nim ?? '-',
                'nilai_total'        => $item->nilai_total ? round((float)$item->nilai_total, 2) : 0,
            ];
        });

        // --- Detail Header ---
        $osce_detail = [
            'id_osce'         => $id_osce,
            'id_osce_stase'   => $id_osce_stase,
            'nama_osce'       => $osceStase->osce->nama_osce,
            'nama_stase'      => $osceStase->stase->nama_stase,
            'waktu_per_rubrik'=> $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa' => $mahasiswaList->count(),
            'nama_penguji'    => $user->penguji->nama,
        ];

        $view = $mode === 'edit'
            ? 'Penguji/EditNilaiForm'
            : 'Penguji/SubmitRubrik';

        return Inertia::render($view, [
            'osce_detail'    => $osce_detail,
            'mahasiswa_list' => $mahasiswaList,
        ]);
    }
}
