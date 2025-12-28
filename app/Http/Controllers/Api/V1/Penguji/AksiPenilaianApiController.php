<?php

namespace App\Http\Controllers\Api\V1\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use App\Models\PoinAspekPenilaian;
use App\Models\User;

class AksiPenilaianApiController extends Controller
{
    /**
     * @param Request $request
     * @param int $id_enrollment_osce
     * @return \Illuminate\Http\JsonResponse
     */
    public function storePenilaian(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        $enrollment = EnrollmentOsce::with('osce')->findOrFail($id_enrollment_osce);

        if (Carbon::now('Asia/Jakarta')->gt(Carbon::parse($enrollment->osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay())) {
            return response()->json([
                'success' => false,
                'message' => 'Masa penilaian OSCE ini telah berakhir. Perubahan nilai tidak diizinkan.',
            ], 400);
        }

        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0|max:4',
            'catatan' => 'nullable|string',
        ]);

        $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)
            ->firstOrFail();

        $totalPoinRubrik = PoinAspekPenilaian::whereHas('aspekPenilaian', function ($q) use ($osceStase) {
            $q->where('id_stase', $osceStase->id_stase);
        })->count();

        if (count($validated['nilai']) !== $totalPoinRubrik) {
            return response()->json([
                'success' => false,
                'message' => "Semua poin penilaian ($totalPoinRubrik poin) wajib diisi sebelum disimpan.",
            ], 422); 
        }

        DB::transaction(function () use ($validated, $enrollment, $id_enrollment_osce) {

            $enrollment->catatan = $validated['catatan'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor'],
                    ]
                );
            }
        });

        $nextEnrollment = $this->findNextStudentInRotation($osceStase);

        return response()->json([
            'success' => true,
            'message' => 'Nilai berhasil disimpan.',
            'data' => [
                'next_enrollment_id' => $nextEnrollment->id_enrollment_osce ?? null
            ]
        ], 200);
    }

    /**
     * @param int $id_osce_stase
     * @return \Illuminate\Http\JsonResponse
     */
    public function rotasi($id_osce_stase)
    {
        $user = Auth::user();

        $osceStase = OsceStase::with('stase')
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji ?? null) 
            ->firstOrFail();

        $nextEnrollment = $this->findNextStudentInRotation($osceStase);

        $mahasiswaSelanjutnya = null;
        if ($nextEnrollment) {
            $nextEnrollment->load('mahasiswa');
            $mahasiswaSelanjutnya = [
                'id_enrollment_osce' => $nextEnrollment->id_enrollment_osce,
                'nama' => $nextEnrollment->mahasiswa->nama,
                'nim' => $nextEnrollment->mahasiswa->nim,
                'prodi' => $nextEnrollment->mahasiswa->prodi,
                'tanggal_sesi' => $nextEnrollment->tanggal_sesi,
                'jam_sesi' => $nextEnrollment->jam_sesi,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Hasil rotasi mahasiswa untuk stase ' . $osceStase->stase->nama_stase,
            'data' => [
                'stase_detail' => [
                    'id_osce_stase' => $osceStase->id_osce_stase,
                    'nama_stase' => $osceStase->stase->nama_stase,
                ],
                'mahasiswa_selanjutnya' => $mahasiswaSelanjutnya,
            ],
        ], 200);
    }

    /**
     * @param OsceStase $osceStase
     * @return EnrollmentOsce|null
     */
    private function findNextStudentInRotation(OsceStase $osceStase)
    {
        $allEnrollments = EnrollmentOsce::where('id_osce', $osceStase->id_osce)
            ->whereDate('tanggal_sesi', $osceStase->tanggal)
            ->whereTime('jam_sesi', '>=', $osceStase->jam_mulai)
            ->whereTime('jam_sesi', '<', $osceStase->jam_selesai)
            ->orderBy('jam_sesi', 'asc')
            ->get();

        $targetStaseId = $osceStase->id_stase;

        $submittedEnrollmentIds = NilaiOsce::whereIn('id_enrollment_osce', $allEnrollments->pluck('id_enrollment_osce'))
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($targetStaseId) {
                $q->where('id_stase', $targetStaseId);
            })
            ->pluck('id_enrollment_osce')
            ->unique()
            ->toArray();

        return $allEnrollments->first(function ($en) use ($submittedEnrollmentIds) {
            return !in_array($en->id_enrollment_osce, $submittedEnrollmentIds);
        });
    }

    /**
     * @param int $id_osce_stase
     * @return \Illuminate\Http\JsonResponse
     */
    public function selesai($id_osce_stase)
    {
        $user = Auth::user();

        $currentOsceStase = OsceStase::where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji ?? null)
            ->firstOrFail();

        $nextStudent = $this->findNextStudentInRotation($currentOsceStase);

        $isSessionComplete = is_null($nextStudent);

        return response()->json([
            'success' => true,
            'status' => $isSessionComplete ? 'inactive' : 'active',
            'message' => $isSessionComplete
                ? 'Sesi penilaian di stase ini telah selesai.'
                : 'Masih ada mahasiswa yang belum dinilai.',
        ], 200);
    }
}
