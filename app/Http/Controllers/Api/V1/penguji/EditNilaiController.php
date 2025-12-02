<?php

namespace App\Http\Controllers\Api\V1\penguji;

use App\Http\Controllers\Controller;
use App\Services\EditNilaiService;
use Illuminate\Http\Request;
use Exception;

class EditNilaiController extends Controller
{
    protected $editNilaiService;

    // Inject Service melalui Constructor
    public function __construct(EditNilaiService $editNilaiService)
    {
        $this->editNilaiService = $editNilaiService;
    }

    /**
     * Tugas 1: GET Form Edit
     * Endpoint: GET /.../penilaian/{id_enrollment_osce}/edit
     */
    public function edit($id_enrollment_osce)
    {
        try {
            // Panggil logika dari Service
            $result = $this->editNilaiService->getEditData($id_enrollment_osce);

            return response()->json([
                'success'     => true,
                'data'        => $result['data'],
                'osce_status' => $result['osce_status']
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tugas 2: PUT Simpan Edit
     * Endpoint: PUT /penguji/penilaian/{id_enrollment_osce}
     * * Request Body Contract:
     * {
     * "feedback": "string | null",
     * "nilai": [
     * { "id_poin_aspek_penilaian": "integer", "skor": "integer" }
     * ]
     * }
     */
    public function update(Request $request, $id_enrollment_osce)
    {
        // 1. Validasi Input sesuai Kontrak BARU
        $request->validate([
            'feedback' => 'nullable|string',
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0', // Validasi menggunakan 'skor'
        ]);

        DB::beginTransaction();
        try {
            // 2. Ambil enrollment lengkap untuk cek status OSCE (memerlukan relasi osceStase yang fix)
            $enrollment = EnrollmentOsce::with('osceStase')->findOrFail($id_enrollment_osce);
            
            // Cek Status OSCE dari relasi (jika osceStase terisi, dianggap aktif)
            $statusOsce = $enrollment->osceStase ? 'Aktif' : 'Tidak Aktif';

            // Jika OSCE tidak aktif
            if (strtolower($statusOsce) !== 'aktif') {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'OSCE tidak aktif. Nilai tidak dapat disimpan.'
                ], 403);
            }

            // 3. Simpan / update Nilai menggunakan updateOrCreate
            $inputNilai = $request->input('nilai', []);
            $savedCount = 0;

            foreach ($inputNilai as $item) {
                // Gunakan 'skor' dari request body sebagai nilai untuk kolom 'nilai' di DB
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce'        => $id_enrollment_osce,
                        'id_poin_aspek_penilaian'   => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor'] // Mapping: request.skor -> db.nilai
                    ]
                );
                $savedCount++;
            }

            // 4. Update Feedback (Asumsi kolom 'feedback' ada di tabel enrollment_osce)
            $enrollment->feedback = $request->input('feedback');
            $enrollment->save();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penilaian dan Feedback berhasil disimpan.',
                'total_updated' => $savedCount
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan: ' . $e->getMessage()
            ], 500);
        }
    }
}