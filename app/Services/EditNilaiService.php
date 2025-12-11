<?php

namespace App\Services;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use Illuminate\Support\Facades\DB;
use Exception;

class EditNilaiService
{
    /**
     * Mengambil data untuk form edit penilaian
     */
    public function getEditData($id_enrollment_osce)
    {
        // 1. Ambil Data Enrollment & Mahasiswa
        $enrollment = EnrollmentOsce::with(['mahasiswa'])
            ->findOrFail($id_enrollment_osce);

        // 2. Ambil OsceStase yang terkait
        $osceStase = null;
        if (!empty($enrollment->id_osce_stase)) {
            $osceStase = OsceStase::with('stase')
                ->where('id_osce_stase', $enrollment->id_osce_stase)
                ->first();
        }

        // Fallback: cari berdasarkan id_osce
        if (!$osceStase && !empty($enrollment->id_osce)) {
            $osceStase = OsceStase::with('stase')
                ->where('id_osce', $enrollment->id_osce)
                ->first();
        }

        // Jika OsceStase tidak ditemukan (Kasus Tidak Aktif/Data Kosong)
        if (!$osceStase) {
            return [
                'osce_status' => 'Tidak Aktif',
                'data' => [
                    'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                    'mahasiswa' => [
                        'id'   => $enrollment->mahasiswa->id_mahasiswa,
                        'nim'  => $enrollment->mahasiswa->nim ?? null,
                        'nama' => $enrollment->mahasiswa->nama ?? null,
                    ],
                    'info_stase'  => null,
                    'penilaian'   => [],
                    'osce_status' => 'Tidak Aktif'
                ]
            ];
        }

        // LOAD RUBRIK + NILAI EXISTING
        $rubrikStruktur = $osceStase->stase->load([
            'aspekPenilaian.poinAspekPenilaian.nilai_osce' => function ($query) use ($id_enrollment_osce) {
                $query->where('id_enrollment_osce', $id_enrollment_osce);
            }
        ]);

        // Tentukan status OSCE
        $osceStatus = 'Aktif';
        if (!empty($osceStase->tanggal)) {
            try {
                $today = date('Y-m-d');
                if ($osceStase->tanggal < $today) {
                    $osceStatus = 'Selesai';
                }
            } catch (\Throwable $t) {
                // ignore parsing errors
            }
        }

        // FORMAT DATA RESPONSE
        $rubrikTerisi = [
            'id_enrollment_osce' => $enrollment->id_enrollment_osce,
            'mahasiswa' => [
                'id'   => $enrollment->mahasiswa->id_mahasiswa,
                'nim'  => $enrollment->mahasiswa->nim ?? null,
                'nama' => $enrollment->mahasiswa->nama ?? null,
            ],
            'info_stase' => [
                'nama_stase' => $rubrikStruktur->nama_stase ?? null,
                'deskripsi'  => $rubrikStruktur->deskripsi ?? null,
            ],
            'penilaian' => $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
                return [
                    'id_aspek'       => $aspek->id_aspek_penilaian,
                    'nama_aspek'     => $aspek->aspek,
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

        return [
            'osce_status' => $osceStatus,
            'data'        => $rubrikTerisi
        ];
    }

    /**
     * Menyimpan data penilaian
     */
    public function updateNilai($id_enrollment_osce, array $items, ?string $inputStatusOsce)
    {
        DB::beginTransaction();
        try {
            $enrollment = EnrollmentOsce::with('osceStase')->findOrFail($id_enrollment_osce);

            // Logika Status
            $statusOsce = $inputStatusOsce;
            if (is_null($statusOsce)) {
                $statusOsce = $enrollment->osceStase ? 'Aktif' : 'Tidak Aktif';
            }

            // Validasi Status Aktif
            if (strtolower($statusOsce) !== 'aktif') {
                throw new Exception("OSCE tidak aktif. Nilai tidak dapat disimpan.", 403);
            }

            // Proses Loop Simpan
            $savedCount = 0;
            foreach ($items as $item) {
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

            return [
                'success' => true,
                'message' => 'Penilaian berhasil disimpan.',
                'total_updated' => $savedCount
            ];

        } catch (Exception $e) {
            DB::rollBack();
            // Lempar ulang exception agar ditangkap controller
            throw $e;
        }
    }
}