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
     * API: Simpan Penilaian (Skor dan Catatan) untuk Mahasiswa tertentu.
     * POST /api/penguji/penilaian/{id_enrollment_osce}
     *
     * @param Request $request
     * @param int $id_enrollment_osce
     * @return \Illuminate\Http\JsonResponse
     */
    public function storePenilaian(Request $request, $id_enrollment_osce)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // 1. Ambil Data Enrollment (dengan relasi OSCE)
        $enrollment = EnrollmentOsce::with('osce')->findOrFail($id_enrollment_osce);

        // 2. Validasi Waktu
        // Membandingkan waktu saat ini dengan tanggal_selesai OSCE (akhir hari)
        if (Carbon::now('Asia/Jakarta')->gt(Carbon::parse($enrollment->osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay())) {
            return response()->json([
                'success' => false,
                'message' => 'Masa penilaian OSCE ini telah berakhir. Perubahan nilai tidak diizinkan.',
            ], 400); // 400 Bad Request
        }

        // 3. Validasi Input (Hanya sekali)
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0|max:4',
            'catatan' => 'nullable|string',
        ]);
        
        // 4. Ambil Context Stase Penguji
        // Mencari jadwal stase yang dipegang penguji pada sesi waktu mahasiswa ini
        $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)
            ->firstOrFail();

        // 5. Validasi Kelengkapan Rubrik (LOGIKA KRITIS)
        $totalPoinRubrik = PoinAspekPenilaian::whereHas('aspekPenilaian', function ($q) use ($osceStase) {
            $q->where('id_stase', $osceStase->id_stase);
        })->count();

        if (count($validated['nilai']) !== $totalPoinRubrik) {
            return response()->json([
                'success' => false,
                'message' => "Semua poin penilaian ($totalPoinRubrik poin) wajib diisi sebelum disimpan.",
            ], 422); // 422 Unprocessable Entity
        }

        // 6. Simpan Data dalam Transaksi
        DB::transaction(function () use ($validated, $enrollment, $id_enrollment_osce) {
            
            // Simpan catatan/feedback
            $enrollment->catatan = $validated['catatan'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                // PART A: HAPUS UPDATE MASTER DATA (PoinAspekPenilaian)
                // PoinAspekPenilaian tidak boleh diupdate dari controller penilaian
                /* PoinAspekPenilaian::where('id_poin_aspek_penilaian', $item['id_poin_aspek_penilaian'])
                    ->update(['skor' => $item['skor']]);
                */
                
                // PART B: INSERT/UPDATE NILAI MENTAH (NilaiOsce)
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor'], // Menggunakan $item['skor'] sesuai input validasi
                    ]
                );
            }
        });

        // 7. Cari Mahasiswa Berikutnya
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
     * API: Dapatkan mahasiswa berikutnya (rotasi) berdasarkan Stase.
     * GET /api/penguji/rotasi/{id_osce_stase}
     *
     * @param int $id_osce_stase
     * @return \Illuminate\Http\JsonResponse
     */
    public function rotasi($id_osce_stase)
    {
        /** @var User $user */
        $user = Auth::user();

        // 1. Ambil & Validasi Stase (Memastikan penguji berhak)
        $osceStase = OsceStase::with('stase')
            ->where('id_osce_stase', $id_osce_stase) 
            ->where('id_penguji', $user->penguji->id_penguji ?? null) // Cek hak akses penguji
            ->firstOrFail();

        // 2. Cari Mahasiswa Berikutnya
        $nextEnrollment = $this->findNextStudentInRotation($osceStase);
        
        $mahasiswaSelanjutnya = null;
        if ($nextEnrollment) {
             // Load relasi mahasiswa hanya jika ada data berikutnya
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

    // =========================================================================
    // HELPER FUNCTIONS (Diambil dari Controller non-API)
    // =========================================================================

    /**
     * Helper untuk mencari mahasiswa berikutnya yang belum dinilai.
     * Memastikan hanya mahasiswa dalam rentang waktu stase yang dicek.
     *
     * @param OsceStase $osceStase
     * @return EnrollmentOsce|null
     */
    private function findNextStudentInRotation(OsceStase $osceStase)
    {
        // 1. Filter Mahasiswa Sesi Ini (Range Waktu)
        $allEnrollments = EnrollmentOsce::where('id_osce', $osceStase->id_osce)
            ->whereDate('tanggal_sesi', $osceStase->tanggal)
            ->whereTime('jam_sesi', '>=', $osceStase->jam_mulai)
            ->whereTime('jam_sesi', '<', $osceStase->jam_selesai) 
            ->orderBy('jam_sesi', 'asc')
            ->get();

        $targetStaseId = $osceStase->id_stase;

        // 2. Cek yang sudah dinilai
        // Menggunakan NilaiOsce untuk mengidentifikasi mahasiswa yang SUDAH dinilai
        $submittedEnrollmentIds = NilaiOsce::whereIn('id_enrollment_osce', $allEnrollments->pluck('id_enrollment_osce'))
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($targetStaseId) {
                $q->where('id_stase', $targetStaseId);
            })
            ->pluck('id_enrollment_osce')
            ->unique()
            ->toArray();

        // 3. Cari Next Student (Mahasiswa di antrian yang belum ada di daftar ID yang sudah dinilai)
        return $allEnrollments->first(function ($en) use ($submittedEnrollmentIds) {
            return !in_array($en->id_enrollment_osce, $submittedEnrollmentIds);
        });
    }

    /**
     * API: Cek apakah sesi penilaian di stase ini sudah selesai (Opsional, dipertahankan dari struktur contoh Anda).
     * GET /api/penguji/selesai/{id_osce_stase}
     *
     * @param int $id_osce_stase
     * @return \Illuminate\Http\JsonResponse
     */
    public function selesai($id_osce_stase)
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Ambil dan Validasi Stase
        $currentOsceStase = OsceStase::where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji ?? null)
            ->firstOrFail();

        // Cek apakah masih ada mahasiswa yang belum dinilai di stase ini
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