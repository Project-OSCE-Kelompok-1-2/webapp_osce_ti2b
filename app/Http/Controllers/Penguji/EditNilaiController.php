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
            }
        ]);

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
                    ];
                })
            ];
        });

        return Inertia::render('Penguji/EditNilaiForm', [
            'mahasiswa' => $enrollment->mahasiswa,
            'rubrik_terisi' => $rubrikTerisi,
            'feedback_tersimpan' => $enrollment->catatan,
            'id_enrollment_osce' => $id_enrollment_osce
        ]);
    }

    /**
     * PUT: Simpan Perubahan Nilai
     */
    public function update(Request $request, $id_enrollment_osce)
    {
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
