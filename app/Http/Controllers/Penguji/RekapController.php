<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\RekapNilaiExport;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;

class RekapController extends Controller
{
    public function rekap(Request $request, $id_osce, $id_osce_stase)
    {

        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $request->query('search'));
        return Inertia::render('Penguji/RekapMahasiswaPage', [
            'osce_detail'    => $data['osce_detail'],
            'mahasiswa_list' => $data['mahasiswa_list']
        ]);
    }



    public function editNilai(Request $request, $id_osce, $id_osce_stase)
    {
        $data = $this->fetchDataCommon($id_osce, $id_osce_stase);

        return Inertia::render('Penguji/EditNilaiForm', [
            'osce_detail'    => $data['osce_detail'],
            'mahasiswa_list' => $data['mahasiswa_list']
        ]);
    }

    public function exportExcel(Request $request, $id_osce, $id_osce_stase)
    {
        $search = $request->query('search');

        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $search);

        $rawOsceName = $data['osce_detail']['nama_osce'] ?? 'OSCE';
        $safeOsceName = preg_replace('/[^A-Za-z0-9\s\-_]/', '_', $rawOsceName);
        $fileName = 'Rekap_Nilai_' . str_replace(' ', '_', $safeOsceName) . '.xlsx';

        return Excel::download(new RekapNilaiExport($data['mahasiswa_list'], $data['osce_detail']), $fileName);
    }

    public function exportPdf(Request $request, $id_osce, $id_osce_stase)
    {
        $search = $request->query('search');

        $data = $this->fetchDataCommon($id_osce, $id_osce_stase, $search);

        $rawOsceName = $data['osce_detail']['nama_osce'] ?? 'OSCE';
        $safeOsceName = preg_replace('/[^A-Za-z0-9\s\-_]/', '_', $rawOsceName);
        $fileName = 'Rekap_Nilai_' . str_replace(' ', '_', $safeOsceName) . '.pdf';

        $pdf = Pdf::loadView('pdf.rekap_nilai_penguji', [ 
            'mahasiswa' => $data['mahasiswa_list'],
            'osce'      => $data['osce_detail']
        ]);

        return $pdf->download($fileName);
    }

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

    private function fetchDataCommon($id_osce, $id_osce_stase, $search = null)
    {
        $osceStase = OsceStase::with(['stase', 'osce', 'penguji'])
            ->where('id_osce', $id_osce)
            ->findOrFail($id_osce_stase);

        $idStase = $osceStase->id_stase;

        $targetTanggal = $osceStase->tanggal->format('Y-m-d');
        $targetJam     = substr($osceStase->jam_mulai, 0, 5);

        $query = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->select([
                'enrollment_osce.*',
                DB::raw("(
                SELECT SUM(no.nilai * pap.bobot) 
                FROM nilai_osce AS no
                JOIN poin_aspek_penilaian AS pap ON no.id_poin_aspek_penilaian = pap.id_poin_aspek_penilaian
                JOIN aspek_penilaian AS ap ON pap.id_aspek_penilaian = ap.id_aspek_penilaian
                WHERE no.id_enrollment_osce = enrollment_osce.id_enrollment_osce
                AND ap.id_stase = $idStase 
            ) as nilai_total")
            ]);

        if ($search) {
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%{$search}%")
                    ->orWhere('nim', 'LIKE', "%{$search}%");
            });
        }

        $mahasiswaRaw = $query->get();

        $mahasiswaFiltered = $mahasiswaRaw->filter(function ($enrollment) use ($targetTanggal, $targetJam) {
            $mhsTanggal = \Carbon\Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
            $mhsJam     = substr((string) $enrollment->jam_sesi, 0, 5);

            return $mhsTanggal === $targetTanggal && $mhsJam === $targetJam;
        });

        $mahasiswaList = $mahasiswaFiltered->map(function ($item) {
            
            $nilaiFinal = null;
            if ($item->nilai_total !== null) {
                $nilaiFinal = round((float)$item->nilai_total, 2) / 4;
            }

            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'        => $item->mahasiswa->nama ?? '-',
                'nim'         => $item->mahasiswa->nim ?? '-',
                'prodi'       => $item->mahasiswa->prodi ?? '-',
                'nilai_total' => $nilaiFinal,
            ];
        })->values();

        $osce_detail = [
            'id_osce'       => $id_osce,
            'id_osce_stase' => $id_osce_stase,
            'nama_osce'     => $osceStase->osce->nama_osce,
            'nama_stase'    => $osceStase->stase->nama_stase,
            'nama_penguji'  => $osceStase->penguji->nama,
            'tanggal'       => $osceStase->tanggal->translatedFormat('d F Y'),
            'jam_mulai'     => $osceStase->jam_mulai,
            'jam_selesai'   => $osceStase->jam_selesai,
            'sesi_label'    => \Carbon\Carbon::parse($osceStase->jam_mulai)->format('H:i') . ' - ' . \Carbon\Carbon::parse($osceStase->jam_selesai)->format('H:i'),
            'durasi_per_mahasiswa' => $osceStase->durasi_per_mahasiswa . ' Menit',
            'total_mahasiswa'      => $mahasiswaList->count(), 
        ];

        return [
            'osce_detail'    => $osce_detail,
            'mahasiswa_list' => $mahasiswaList
        ];
    }
}
