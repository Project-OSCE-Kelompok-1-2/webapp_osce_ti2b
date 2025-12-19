<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

// Models
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\Osce;
use App\Models\OsceStase;

class AksiPenilaianController extends Controller
{
    private function cekWaktuHabis($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $batasWaktu = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();

        return Carbon::now('Asia/Jakarta')->gt($batasWaktu);
    }

    public function store(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);

        if ($this->cekWaktuHabis($enrollment->id_osce)) {
            return back()->withErrors(['error' => 'Masa penilaian OSCE ini telah berakhir.']);
        }

        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer',
            'nilai.*.skor' => 'required|integer|min:0|max:4',
            'feedback' => 'nullable|string',
        ]);

        $staseContext = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)

            ->firstOrFail();

        DB::transaction(function () use ($validated, $id_enrollment_osce, $enrollment) {
            $enrollment->catatan = $validated['feedback'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor']
                    ]
                );
            }
        });

        return redirect()->route('penguji.rotasi', [
            'id_osce' => $enrollment->id_osce,
            'id_osce_stase' => $staseContext->id_osce_stase
        ])->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Mencari mahasiswa selanjutnya dan menampilkan halaman tunggu.
     */
    public function rotasi($id_osce, $id_osce_stase)
    {
        $user = Auth::user();
        $penguji = $user->penguji;

        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $penguji->id_penguji)
            ->firstOrFail();

        $tglJadwal   = $osceStase->tanggal;
        $jamMulai    = $osceStase->jam_mulai;
        $jamSelesai  = $osceStase->jam_selesai;

        $allEnrollments = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tglJadwal)
            ->whereTime('jam_sesi', '>=', $jamMulai)
            ->whereTime('jam_sesi', '<', $jamSelesai) 
            ->orderBy('jam_sesi', 'asc')
            ->get();

        $sudahDinilaiIds = NilaiOsce::whereIn('id_enrollment_osce', $allEnrollments->pluck('id_enrollment_osce'))
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            ->whereNotNull('nilai')
            // ---------------------------
            ->pluck('id_enrollment_osce')
            ->toArray();

        $currentRequestTime = Carbon::now()->format('H:i:s');

        $nextStudent = $allEnrollments->first(function ($enrollment) use ($sudahDinilaiIds, $currentRequestTime) {
            if (in_array($enrollment->id_enrollment_osce, $sudahDinilaiIds)) {
                return false;
            }

            return true;
        });

        $mahasiswaSelanjutnya = null;
        if ($nextStudent) {
            $mahasiswaSelanjutnya = [
                'id_enrollment_osce' => $nextStudent->id_enrollment_osce,
                'nama' => $nextStudent->mahasiswa->nama,
                'nim' => $nextStudent->mahasiswa->nim,
                'prodi' => $nextStudent->mahasiswa->prodi,
            ];
        }

        return Inertia::render('Penguji/LiveRotasi', [
            'osce_detail' => [
                'id_osce' => $osceStase->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
                'nama_osce' => $osceStase->osce->nama_osce,
                'nama_stase' => $osceStase->stase->nama_stase,
            ],
            'mahasiswa_selanjutnya' => $mahasiswaSelanjutnya, 
            'sisa_waktu_rotasi_detik' => 60
        ]);
    }

    /**
     * Menampilkan list mahasiswa sebelum submit final.
     */
    public function submitRubrik($id_osce, $id_osce_stase)
    {
        $user = Auth::user();

        $osceStase = OsceStase::with(['osce', 'stase', 'penguji'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

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

        $mahasiswaRaw = $query->get();

        $mahasiswaFiltered = $mahasiswaRaw->filter(function ($enrollment) use ($targetTanggal, $targetJam) {
            $mhsTanggal = \Carbon\Carbon::parse($enrollment->tanggal_sesi)->format('Y-m-d');
            $mhsJam     = substr((string) $enrollment->jam_sesi, 0, 5);
            return $mhsTanggal === $targetTanggal && $mhsJam === $targetJam;
        });

        $mahasiswaList = $mahasiswaFiltered->map(function ($item) {
            return [
                'id_enrollment_osce' => $item->id_enrollment_osce,
                'nama'        => $item->mahasiswa->nama,
                'nim'         => $item->mahasiswa->nim,
                'nilai_total' => $item->nilai_total ? round((float)$item->nilai_total, 2) / 4 : 0,
                'status'      => $item->nilai_total ? 'Sudah Dinilai' : 'Belum Dinilai',
            ];
        })->values();

        return Inertia::render('Penguji/SubmitRubrik', [
            'osce_detail' => [
                'id_osce'              => $osceStase->id_osce,
                'id_osce_stase'        => $osceStase->id_osce_stase,
                'nama_osce'            => $osceStase->osce->nama_osce,
                'nama_stase'           => $osceStase->stase->nama_stase,
                'durasi_per_mahasiswa' => $osceStase->durasi_per_mahasiswa . ' Menit',
                'total_mahasiswa'      => $mahasiswaList->count(), 
            ],
            'mahasiswa_list' => $mahasiswaList
        ]);
    }

    public function selesai($id_osce, $id_osce_stase)
    {
        return redirect()->route('penguji.osce.index')
            ->with('success', 'Sesi penilaian stase ini telah selesai.');
    }
}