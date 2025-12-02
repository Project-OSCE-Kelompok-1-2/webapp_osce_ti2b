<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;

class EditNilaiController extends Controller
{
    /**
     * Tugas 1: GET Form Edit
     * Endpoint: GET /.../penilaian/{id_enrollment_osce}/edit
     */
    public function edit($id_enrollment_osce)
    {
        try {
            // 1. Ambil Data Enrollment & Mahasiswa (pastikan ada)
            $enrollment = EnrollmentOsce::with(['mahasiswa'])
                ->findOrFail($id_enrollment_osce);

            // 2. Ambil OsceStase yang terkait 
            $osceStase = null;
            if (!empty($enrollment->id_osce_stase)) {
                $osceStase = OsceStase::with('stase')
                    ->where('id_osce_stase', $enrollment->id_osce_stase)
                    ->first();
            }

            // Fallback: cari berdasarkan id_osce (jika id_osce_stase tidak ada)
            if (!$osceStase && !empty($enrollment->id_osce)) {
                $osceStase = OsceStase::with('stase')
                    ->where('id_osce', $enrollment->id_osce)
                    ->first();
            }

            // Jika tetap tidak ditemukan, coba ambil satu atau throw
            if (!$osceStase) {

                $osceStatus = 'Tidak Aktif';
                return response()->json([
                    'success' => true,
                    'data' => [
                        'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                        'mahasiswa' => [
                            'id' => $enrollment->mahasiswa->id_mahasiswa,
                            'nim' => $enrollment->mahasiswa->nim ?? null,
                            'nama' => $enrollment->mahasiswa->nama ?? null,
                        ],
                        'info_stase' => null,
                        'penilaian' => [],
                        'osce_status' => $osceStatus
                    ]
                ], 200);
            }

            // LOAD RUBRIK + NILAI EXISTING (filter nilai berdasarkan enrollment ini)
            $rubrikStruktur = $osceStase->stase->load([
                'aspekPenilaian.poinAspekPenilaian.nilai_osce' => function ($query) use ($id_enrollment_osce) {
                    $query->where('id_enrollment_osce', $id_enrollment_osce);
                }
            ]);

            // Tentukan status OSCE sebagai variabel (tanpa bergantung kolom DB)
            $osceStatus = 'Aktif'; // default

            if (!empty($osceStase->tanggal)) {
                try {
                    $today = date('Y-m-d');
                    if ($osceStase->tanggal < $today) {
                        $osceStatus = 'Selesai';
                    }
                } catch (\Throwable $t) {
                    // ignore parsing errors, tetap 'Aktif'
                }
            }

            // FORMAT RESPONSE (
            $rubrikTerisi = [
                'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                'mahasiswa' => [
                    'id'   => $enrollment->mahasiswa->id_mahasiswa,
                    'nim'  => $enrollment->mahasiswa->nim ?? null,
                    'nama' => $enrollment->mahasiswa->nama ?? null,
                ],
                'info_stase' => [
                    'nama_stase' => $rubrikStruktur->nama_stase ?? notnull,
                    'deskripsi'  => $rubrikStruktur->deskripsi ?? null,
                ],
                'penilaian' => $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
                    return [
                        'id_aspek' => $aspek->id_aspek_penilaian,
                        'nama_aspek' => $aspek->aspek,
                        'bobot_maksimum' => $aspek->bobot_maksimum,
                        'kompetensi_list' => $aspek->poinAspekPenilaian->map(function ($poin) {
                            $nilaiInput = $poin->nilai_osce ? $poin->nilai_osce->nilai : 0;

                            return [
                                'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                                'kompetensi'    => $poin->kompetensi,
                                'skor_maksimal' => $poin->skor,
                                'bobot'         => $poin->bobot,
                                'nilai_input'   => $nilaiInput
                            ];
                        })
                    ];
                })
            ];

            return response()->json([
                'success' => true,
                'data' => $rubrikTerisi,
                'osce_status' => $osceStatus
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tugas 2: PUT Simpan Edit
     * Endpoint: PUT /.../penilaian/{id_enrollment_osce}
     */
    public function update(Request $request, $id_enrollment_osce)
    {
        // Validasi input
        $request->validate([
            'items' => 'required|array',
            'items.*.id_poin_aspek_penilaian' => 'required|integer|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'items.*.nilai' => 'required|numeric|min:0',
            // optional: if front-end may pass status variable:
            'osce_status' => 'sometimes|string'
        ]);

        DB::beginTransaction();
        try {
            // Ambil enrollment lengkap termasuk relasi osceStase (jika ada)
            $enrollment = EnrollmentOsce::with('osceStase')->findOrFail($id_enrollment_osce);

            // Tentukan status OSCE tanpa membaca kolom DB:
            // preferensi: jika front-end mengirim osce_status gunakan itu,
            // kalau tidak, tentukan berdasarkan ada/tidaknya osceStase (atau logika lain)
            $statusOsce = $request->input('osce_status');
            if (is_null($statusOsce)) {
                $statusOsce = $enrollment->osceStase ? 'Aktif' : 'Tidak Aktif';
            }

            // Jika OSCE tidak aktif (berdasarkan variabel saja), tolak simpan
            if (strtolower($statusOsce) !== 'aktif') {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'OSCE tidak aktif. Nilai tidak dapat disimpan.'
                ], 403);
            }

            // Simpan / update setiap poin menggunakan updateOrCreate
            $inputItems = $request->input('items', []);
            $savedCount = 0;

            foreach ($inputItems as $item) {
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce'      => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['nilai']
                    ]
                );
                $savedCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penilaian berhasil disimpan.',
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
