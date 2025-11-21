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
            // 1. Ambil Data Enrollment & Mahasiswa
            $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
                ->findOrFail($id_enrollment_osce);

            // ---------------------------------------------------------
            // LOGIKA MENGAMBIL STASE PENGUJI
            // ---------------------------------------------------------
            // Mengambil data OsceStase berdasarkan OSCE ini dan Penguji yang login.
            // Asumsi: User yang login adalah penguji yg terdaftar di tabel osce_stase.
            $userId = Auth::id(); 

            $osceStase = OsceStase::with('stase')
                ->where('id_osce', $enrollment->id_osce)
                // ->where('id_penguji', $userId) // UNCOMMENT baris ini jika sudah ada sistem login penguji
                ->first();

            if (!$osceStase) {
                // Fallback jika data osce_stase tidak ditemukan (misal testing admin)
                // Ambil stase pertama yg ada di osce tsb
                $osceStase = OsceStase::with('stase')
                    ->where('id_osce', $enrollment->id_osce)
                    ->firstOrFail();
            }

            // ---------------------------------------------------------
            // QUERY RUBRIK + NILAI (MENGGUNAKAN RELASI BARU)
            // ---------------------------------------------------------
            // memuat struktur: Stase -> Aspek -> Poin
            // Serta langsung memuat 'nilai_osce' TAPI difilter khusus enrollment ini.
            
            $rubrikStruktur = $osceStase->stase->load([
                'aspekPenilaian.poinAspekPenilaian.nilai_osce' => function ($query) use ($id_enrollment_osce) {
                    // Constraint: Hanya ambil nilai milik enrollment siswa ini
                    $query->where('id_enrollment_osce', $id_enrollment_osce);
                }
            ]);

            // ---------------------------------------------------------
            // FORMAT RESPONSE
            // ---------------------------------------------------------
            $rubrikTerisi = [
                'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                'mahasiswa' => [
                    'id'   => $enrollment->mahasiswa->id_mahasiswa,
                    'nim'  => $enrollment->mahasiswa->nim,
                    'nama' => $enrollment->mahasiswa->nama,
                ],
                'info_stase' => [
                    'nama_stase' => $rubrikStruktur->nama_stase,
                    'deskripsi'  => $rubrikStruktur->deskripsi,
                ],
                // Mapping data Aspek
                'penilaian' => $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
                    return [
                        'id_aspek' => $aspek->id_aspek_penilaian,
                        'nama_aspek' => $aspek->aspek,
                        'bobot_maksimum' => $aspek->bobot_maksimum,
                        // Mapping data Poin Kompetensi
                        'kompetensi_list' => $aspek->poinAspekPenilaian->map(function ($poin) {
                            // Cek apakah relasi nilai_osce ada isinya
                            $nilaiInput = $poin->nilai_osce ? $poin->nilai_osce->nilai : 0;

                            return [
                                'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                                'kompetensi'    => $poin->kompetensi,
                                'skor_maksimal' => $poin->skor,
                                'bobot'         => $poin->bobot,
                                'nilai_input'   => $nilaiInput // Nilai diambil langsung dari relasi
                            ];
                        })
                    ];
                })
            ];

            return response()->json([
                'success' => true,
                'data' => $rubrikTerisi
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tugas 2: PUT Simpan Edit
     * Endpoint: PUT /.../penilaian/{id_enrollment_osce}
     */
    public function update(Request $request, $id_enrollment_osce)
    {
        // Validasi
        $request->validate([
            'items' => 'required|array',
            'items.*.id_poin_aspek_penilaian' => 'required|integer|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'items.*.nilai' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $inputItems = $request->input('items');
            $savedCount = 0;

            foreach ($inputItems as $item) {
                // Menggunakan updateOrCreate untuk menyimpan nilai
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
