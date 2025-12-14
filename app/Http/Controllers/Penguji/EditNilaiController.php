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
    $user = Auth::user();

    // 1. Ambil Data Enrollment
    $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])->findOrFail($id_enrollment_osce);

    // 2. Ambil Data Stase & Validasi Penguji
    $osceStase = OsceStase::with(['stase', 'osce'])
        ->where('id_osce', $enrollment->id_osce)
        ->where('id_penguji', $user->penguji->id_penguji)
        ->firstOrFail();

    // 3. Ambil Struktur Rubrik + Nilai Tersimpan
    $rubrikStruktur = $osceStase->stase->load([
        'aspekPenilaian.poinAspekPenilaian.nilai_osce' => function ($query) use ($id_enrollment_osce) {
            $query->where('id_enrollment_osce', $id_enrollment_osce);
        }
    ]);

    // 4. Format Rubrik (Sama seperti kode Anda)
    $rubrikTerisi = $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
        return [
            'aspek' => $aspek->aspek,
            'kompetensi' => $aspek->poinAspekPenilaian->map(function ($poin) {
                // Pastikan relasi ini mengambil satu object (hasOne) atau ambil yang pertama dari collection
                $nilaiDb = $poin->nilai_osce->first() ?? null; 

                return [
                    'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                    'deskripsi'     => $poin->kompetensi,
                    'bobot'         => $poin->bobot,
                    'skor_maksimal' => 4,
                    'skor'          => $nilaiDb ? $nilaiDb->nilai : 0
                ];
            })
        ];
    });

    // --- PERBAIKAN: Buat Data osce_detail ---
    $osceDetail = [
        'id_osce'              => $osceStase->osce->id_osce,
        'id_osce_stase'        => $osceStase->id_osce_stase,
        'nama_osce'            => $osceStase->osce->nama, // Sesuaikan nama kolom DB
        'nama_stase'           => $osceStase->stase->nama,
        'durasi_per_mahasiswa' => $osceStase->osce->durasi_per_mahasiswa ?? 15,
        'nama_penguji'         => $user->nama,
        'total_mahasiswa'      => EnrollmentOsce::where('id_osce', $enrollment->id_osce)->count(),
    ];

    return Inertia::render('Penguji/EditNilaiForm', [
        'mahasiswa'          => $enrollment->mahasiswa,
        'rubrik_terisi'      => $rubrikTerisi,
        'feedback_tersimpan' => $enrollment->catatan,
        'id_enrollment_osce' => $id_enrollment_osce,
        'osce_detail'        => $osceDetail, // <--- INI PENTING DIKIRIM
    ]);
}

    /**
     * PUT: Simpan Perubahan Nilai yang terjadi
     */
    public function update(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        // 1. Validasi Input
        $validated = $request->validate([
            'nilai' => 'required|array',
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

        $batasWaktu = Carbon::parse($osceStase->osce->tanggal_selesai)->endOfDay();
        if (Carbon::now()->gt($batasWaktu)) {
            return back()->withErrors(['error' => 'Masa pengeditan nilai sudah berakhir.']);
        }

        // 3. Simpan Data
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

        return redirect()->route('penguji.rekap.list', [
            'id_osce' => $osceStase->id_osce,
            'id_osce_stase' => $osceStase->id_osce_stase
        ])->with('success', 'Nilai berhasil diperbarui.');
    }
}
