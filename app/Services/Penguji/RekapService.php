<?php

namespace App\Services\Penguji;

use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RekapService
{
    public function getRekapData($id_osce, $id_osce_stase)
    {
        $user = Auth::user();

        // Validasi user wajib punya profil penguji
        if (!$user->penguji) {
            abort(403, 'Akun Anda tidak memiliki profil Penguji.');
        }

        // Validasi akses stase penguji
        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        $idStase = (int) $osceStase->id_stase;

        // Query nilai mahasiswa
        $mahasiswaRaw = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                DB::raw("(
                    SELECT SUM(no.nilai * pap.bobot) 
                    FROM nilai_osce AS no
                    JOIN poin_aspek_penilaian AS pap 
                        ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                    JOIN aspek_penilaian AS ap 
                        ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                    WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                    AND ap.id_stase = $idStase
                ) as nilai_total")
            ])
            ->get();

        return [
            'osce' => $osceStase,
            'penguji' => $user->penguji,
            'mahasiswa' => $mahasiswaRaw
        ];
    }
}
