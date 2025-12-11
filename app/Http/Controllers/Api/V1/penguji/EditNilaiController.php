<?php

namespace App\Http\Controllers\Api\V1\penguji;

use App\Http\Controllers\Controller;
use App\Services\EditNilaiService; // Jika service ini tidak digunakan di Controller, bisa dihapus
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase; 
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Exception;

class EditNilaiController extends Controller
{
/**
     * GET: Halaman Edit Nilai (API Version)
     * Endpoint: GET /api/penilaian/{id_enrollment_osce}/edit
     */
    public function edit($id_enrollment_osce)
    {
        $user = Auth::user();

        try {
            // 1. Ambil Data Enrollment
            $enrollment = EnrollmentOsce::with(['mahasiswa'])->findOrFail($id_enrollment_osce);

            // 2. Validasi Akses Penguji & Ambil OsceStase
            $osceStase = OsceStase::with(['stase', 'osce'])
                ->where('id_osce', $enrollment->id_osce)
                ->where('id_penguji', $user->penguji->id_penguji ?? null)
                ->firstOrFail();

            // 3. Ambil Struktur Rubrik + Nilai Tersimpan
            $rubrikStruktur = $osceStase->stase->load([
                'aspekPenilaian.poinAspekPenilaian.nilaiOsce' => function ($query) use ($id_enrollment_osce) {
                    $query->where('id_enrollment_osce', $id_enrollment_osce);
                }
            ]);

            // 4. Tentukan Status OSCE (Aktif / Selesai)
            $osceStatus = 'Aktif';
            if ($osceStase->osce && $osceStase->osce->tanggal_selesai) {
                $batasWaktu = Carbon::parse($osceStase->osce->tanggal_selesai)->endOfDay();
                if (Carbon::now()->gt($batasWaktu)) {
                    $osceStatus = 'Selesai';
                }
            }

            // 5. Format Response (Kembali ke struktur awal yang lebih detail)
            $penilaianList = $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
                return [
                    // Detail Aspek
                    'id_aspek' => (int) $aspek->id_aspek_penilaian,
                    'nama_aspek' => $aspek->aspek,
                    'bobot_maksimum' => (int) $aspek->bobot_maksimum, 
                    
                    // List Kompetensi (Poin Penilaian)
                    'kompetensi_list' => $aspek->poinAspekPenilaian->map(function ($poin) {
                        $nilaiDb = $poin->nilaiOsce->first(); 

                        return [
                            'id_poin_aspek_penilaian' => (int) $poin->id_poin_aspek_penilaian,
                            'kompetensi'      => $poin->kompetensi, 
                            'skor_maksimal'   => (int) ($poin->skor ?? 4),
                            'bobot'           => (int) $poin->bobot,
                            'nilai_input'     => $nilaiDb ? (int) $nilaiDb->nilai : 0
                        ];
                    })->values() // Pastikan ini ada agar menjadi array di JSON
                ];
            })->values(); // Pastikan ini ada agar menjadi array di JSON

            // 6. Susun Response Akhir
            $responsePayload = [
                'id_enrollment_osce' => (int) $id_enrollment_osce,
                'mahasiswa' => [
                    'id'    => (int) $enrollment->mahasiswa->id_mahasiswa,
                    'nim'   => $enrollment->mahasiswa->nim ?? null,
                    'nama'  => $enrollment->mahasiswa->nama ?? null,
                ],
                'info_stase' => [
                    'nama_stase' => $rubrikStruktur->nama_stase ?? null,
                    'deskripsi'  => $rubrikStruktur->deskripsi ?? null,
                ],
                'feedback_tersimpan' => $enrollment->catatan,
                'penilaian' => $penilaianList 
            ];
            return response()->json([
                'success' => true,
                'data' => $responsePayload,
                'osce_status' => $osceStatus // di root level
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan atau Anda tidak memiliki akses ke penilaian ini.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penilaian: ' . $e->getMessage()
            ], 500);
        }
    }

    // --- TUGAS 2: PUT SIMPAN EDIT ---

    /**
     * PUT Simpan Edit
     * Endpoint: PUT /penguji/penilaian/{id_enrollment_osce}
     * Request Body Contract:
     * { "feedback": "string | null", "nilai": [{ "id_poin_aspek_penilaian": 1, "skor": 4 }, ...] }
     */
    public function update(Request $request, $id_enrollment_osce)
    {
        // 1. Validasi Input sesuai Kontrak
        $request->validate([
            'feedback' => 'nullable|string',
            'nilai'    => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // 2. Ambil data Enrollment beserta Relasi OSCE untuk pengecekan Tanggal
            // Pastikan model EnrollmentOsce memiliki relasi 'osce'
            $enrollment = EnrollmentOsce::with('osce')->findOrFail($id_enrollment_osce);

            // 3. Validasi Akses Penguji (Optional, namun DIREKOMENDASIKAN)
            // Cek apakah penguji yang sedang login berhak menilai Enrollment ini
            $user = Auth::user();
            // Asumsi id_osce_stase ada di EnrollmentOsce, atau cari OsceStase berdasarkan id_osce dan id_penguji
            $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
                            ->where('id_penguji', $user->penguji->id_penguji ?? null)
                            ->first();

            if (!$osceStase) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak untuk mengubah penilaian pada stase ini.',
                ], 403);
            }
            
            // 4. Logika Status OSCE untuk mencekal penyimpanan
            $statusOsce = 'Aktif';
            if (!$enrollment->osce) {
                $statusOsce = 'Tidak Aktif';
            } 
            elseif (Carbon::now()->gt(Carbon::parse($enrollment->osce->tanggal_selesai)->endOfDay())) {
                $statusOsce = 'Selesai';
            }

            if ($statusOsce !== 'Aktif') {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'OSCE sudah selesai atau tidak aktif. Nilai tidak dapat diubah.',
                    'current_status' => $statusOsce
                ], 403);
            }

            // 5. Simpan Feedback (Catatan)
            $enrollment->catatan = $request->input('feedback');
            $enrollment->save();

            // 6. Simpan / Update Nilai (Looping)
            $inputNilai = $request->input('nilai', []);
            $savedCount = 0;

            foreach ($inputNilai as $item) {
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce'      => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor'] 
                    ]
                );
                $savedCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penilaian dan Feedback berhasil disimpan.',
                'data' => [
                    'id_enrollment_osce' => $id_enrollment_osce,
                    'total_nilai_saved'  => $savedCount,
                    'status_osce'        => $statusOsce
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Enrollment data not found.',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }
}