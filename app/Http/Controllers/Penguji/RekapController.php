<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Osce;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;

class RekapController extends Controller
{
    /**
     * MODE EDIT → GET /.../edit-nilai
     */
    public function editNilai(Request $request, $osce_id)
    {
        // Ambil detail OSCE
        $osce = Osce::with(['stase', 'sesi'])->findOrFail($osce_id);

        // Ambil list mahasiswa + total nilai
        $mahasiswa_list = EnrollmentOsce::query()
            ->where('osce_id', $osce_id)
            ->with('mahasiswa')
            ->select([
                'enrollment_osce.*',
                DB::raw("(SELECT SUM(no.nilai) 
                          FROM nilai_osce AS no 
                          WHERE no.enrollment_id = enrollment_osce.id) AS nilai_total")
            ])
            ->get();

        return inertia('Penguji/EditNilaiPage', [
            'osce' => $osce,
            'mahasiswa_list' => $mahasiswa_list,
            'mode' => 'edit'
        ]);
    }


    /**
     * MODE REKAP → GET /.../rekap
     * (logic sama, hanya beda mode output)
     */
    public function rekap(Request $request, $osce_id)
    {
        // Ambil detail OSCE
        $osce = Osce::with(['stase', 'sesi'])->fi<?php

{
    /**
     * MODE EDIT → GET /.../edit-nilai
     */
    public function editNilai(Request $request, $osce_id)
    {
        // Ambil detail OSCE
        $osce = Osce::with(['stase', 'sesi'])->findOrFail($osce_id);

        // Ambil list mahasiswa + total nilai
        $mahasiswa_list = EnrollmentOsce::query()
            ->where('osce_id', $osce_id)
            ->with('mahasiswa')
            ->select([
                'enrollment_osce.*',
                DB::raw("(SELECT SUM(no.nilai) 
                          FROM nilai_osce AS no 
                          WHERE no.enrollment_id = enrollment_osce.id) AS nilai_total")
            ])
            ->get();

        return inertia('Penguji/EditNilaiPage', [
            'osce' => $osce,
            'mahasiswa_list' => $mahasiswa_list,
            'mode' => 'edit'
        ]);
    }


    /**
     * MODE REKAP → GET /.../rekap
     * (logic sama, hanya beda mode output)
     */
    public function rekap(Request $request, $osce_id)
    {
        // Ambil detail OSCE
        $osce = Osce::with(['stase', 'sesi'])->findOrFail($osce_id);

        // Ambil list mahasiswa + total nilai
        $mahasiswa_list = EnrollmentOsce::query()
            ->where('osce_id', $osce_id)
            ->with('mahasiswa')
            ->select([
                'enrollment_osce.*',
                DB::raw("(SELECT SUM(no.nilai) 
                          FROM nilai_osce AS no 
                          WHERE no.enrollment_id = enrollment_osce.id) AS nilai_total")
            ])
            ->get();

        return inertia('Penguji/RekapPage', [
            'osce' => $osce,
            'mahasiswa_list' => $mahasiswa_list,
            'mode' => 'rekap'
        ]);
    }
}
ndOrFail($osce_id);

        // Ambil list mahasiswa + total nilai
        $mahasiswa_list = EnrollmentOsce::query()
            ->where('osce_id', $osce_id)
            ->with('mahasiswa')
            ->select([
                'enrollment_osce.*',
                DB::raw("(SELECT SUM(no.nilai) 
                          FROM nilai_osce AS no 
                          WHERE no.enrollment_id = enrollment_osce.id) AS nilai_total")
            ])
            ->get();

        return inertia('Penguji/RekapPage', [
            'osce' => $osce,
            'mahasiswa_list' => $mahasiswa_list,
            'mode' => 'rekap'
        ]);
    }
}
