<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;

class EditNilaiController extends Controller
{
    /**
     * GET: Halaman Edit Nilai
     */
    public function edit($id_enrollment_osce)
    {
<<<<<<< HEAD
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
=======
        $user = Auth::user();
        
        // 1. Ambil Data & Validasi Akses Penguji
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])->findOrFail($id_enrollment_osce);

        $osceStase = OsceStase::with(['stase', 'osce'])
            ->where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail(); // Otomatis 404 jika penguji tidak berhak

        // 2. Cek Batas Waktu Edit (Optional: kalau mau readonly saat waktu habis)
        // $isExpired = Carbon::now()->gt($osceStase->osce->tanggal_selesai);

        // 3. Ambil Struktur Rubrik + Nilai Tersimpan
        // Menggunakan teknik eager loading constraint seperti kode asli Najwa (sudah bagus)
        $rubrikStruktur = $osceStase->stase->load([
            'aspekPenilaian.poinAspekPenilaian.nilaiOsce' => function ($query) use ($id_enrollment_osce) {
                $query->where('id_enrollment_osce', $id_enrollment_osce);
>>>>>>> 2916bf509666ab2a5ef42d8fed3d28ebfba5f34c
            }
        ]);

<<<<<<< HEAD
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
=======
        // 4. Format Response untuk Frontend
        // Kita mapping agar sesuai dengan props yang diminta Frontend (Sendy/Hafizh)
        $rubrikTerisi = $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
            return [
                'aspek' => $aspek->aspek,
                'kompetensi' => $aspek->poinAspekPenilaian->map(function ($poin) {
                    $nilaiDb = $poin->nilaiOsce->first(); // Ambil relasi hasOne/hasMany
                    return [
                        'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                        'deskripsi'     => $poin->kompetensi,
                        'bobot'         => $poin->bobot,
                        'skor_maksimal' => 4, // Asumsi skala 0-4
                        'skor'          => $nilaiDb ? $nilaiDb->nilai : 0 // Nilai tersimpan
>>>>>>> 2916bf509666ab2a5ef42d8fed3d28ebfba5f34c
                    ];
                })
            ];
        });

<<<<<<< HEAD
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
=======
        return Inertia::render('Penguji/EditNilaiForm', [
            'mahasiswa' => $enrollment->mahasiswa,
            'rubrik_terisi' => $rubrikTerisi,
            'feedback_tersimpan' => $enrollment->catatan,
            'id_enrollment_osce' => $id_enrollment_osce
        ]);
>>>>>>> 2916bf509666ab2a5ef42d8fed3d28ebfba5f34c
    }

    /**
     * PUT: Simpan Perubahan Nilai
     */
    public function update(Request $request, $id_enrollment_osce)
    {
<<<<<<< HEAD
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
=======
        $user = Auth::user();

        // 1. Validasi Input
        $validated = $request->validate([
            'nilai' => 'required|array', // Ganti 'items' jadi 'nilai' biar konsisten sama Frontend
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer',
            'nilai.*.skor' => 'required|integer|min:0|max:4',
            'feedback' => 'nullable|string',
        ]);

        // 2. Security & Time Check
        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);
        
        $osceStase = OsceStase::with('osce')
            ->where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        // Cek Tanggal Selesai
        $batasWaktu = Carbon::parse($osceStase->osce->tanggal_selesai)->endOfDay();
        if (Carbon::now()->gt($batasWaktu)) {
            return back()->withErrors(['error' => 'Masa pengeditan nilai sudah berakhir.']);
        }

        // 3. Simpan Data
        DB::transaction(function () use ($validated, $id_enrollment_osce, $enrollment) {
            // Update Feedback
            $enrollment->catatan = $validated['feedback'] ?? null;
            $enrollment->save();

            // Update Nilai
            foreach ($validated['nilai'] as $item) {
>>>>>>> 2916bf509666ab2a5ef42d8fed3d28ebfba5f34c
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

        // Redirect kembali (biasanya ke list rekap)
        return redirect()->route('penguji.rekap.list', [
            'id_osce' => $osceStase->id_osce,
            'id_osce_stase' => $osceStase->id_osce_stase
        ])->with('success', 'Nilai berhasil diperbarui.');
    }
}