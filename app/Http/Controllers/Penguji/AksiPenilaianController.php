<?php

namespace App\Http\Controllers\Penguji;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use App\Models\PoinAspekPenilaian;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Carbon;
use Inertia\Inertia; // *** WAJIB: IMPORT UNTUK Inertia::render() ***

class AksiPenilaianController extends Controller
{
    /**
     * TUGAS 1: POST /penguji/penilaian/{id_enrollment_osce} (Simpan Nilai)
     * Catatan: Setelah POST, kita HARUS menggunakan Redirect (PRG Pattern) agar
     * browser tidak meminta pengiriman ulang form.
     */
    public function store(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        // 1. Ambil Data & Validasi Akses
        $enrollment = EnrollmentOsce::with('osce', 'osceStase')->findOrFail($id_enrollment_osce);
        
        // Asumsi: EnrollmentOsce memiliki kolom id_osce_stase untuk mengidentifikasi stase mana yang menilai.
        $osceStase = OsceStase::where('id_osce_stase', $enrollment->id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        // 2. Validasi Input & Cek Waktu
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0|max:4',
            'catatan' => 'nullable|string',
        ]);

        // Cek Batas Waktu
        if (Carbon::now()->gt($enrollment->osce->tanggal_selesai)) {
            return Redirect::back()->withErrors(['error' => 'Masa pengeditan/penilaian sudah berakhir.']);
        }
        
        // --- LOGIKA KRITIS: Validasi Kelengkapan Skor ---
        $totalPoinRubrik = PoinAspekPenilaian::whereHas('aspekPenilaian', function ($q) use ($osceStase) {
            $q->where('id_stase', $osceStase->id_stase);
        })->count();

        if (count($validated['nilai']) !== $totalPoinRubrik) {
            return Redirect::back()->withErrors(['error' => 'Semua poin penilaian (' . $totalPoinRubrik . ' poin) harus diisi sebelum disimpan.']);
        }
        // --------------------------------------------------

        // 3. Simpan Data
        DB::transaction(function () use ($validated, $enrollment, $id_enrollment_osce) {
            
            // Simpan catatan/feedback
            $enrollment->catatan = $validated['catatan'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                // PART A: UPDATE MASTER DATA (POIN_ASPEK_PENILAIAN)
                PoinAspekPenilaian::where('id_poin_aspek_penilaian', $item['id_poin_aspek_penilaian'])
                    ->update(['skor' => $item['skor']]);
                
                // PART B: INSERT/UPDATE NILAI MENTAH (NILAI_OSCE)
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        // KOREKSI: Menyimpan skor mentah (0-4) dari input
                        'nilai' => $item['skor'], 
                    ]
                );
            }
        });

        // 4. Redirect ke mahasiswa berikutnya di antrian stase ini
        // Kita tetap menggunakan Redirect::route di sini (PRG Pattern)
        return $this->redirectToNextRotation($osceStase);
    }

    /**
     * TUGAS 2: GET /.../rotasi (mencari mahasiswa selanjutnya di antrian stase ini)
     * Mengarahkan ke halaman LivePenilaian jika ada mahasiswa, atau ke LiveRotasi jika habis.
     */
    public function rotasi($id_osce_stase)
    {
        $osceStase = OsceStase::findOrFail($id_osce_stase);
        
        $nextEnrollment = $this->findNextStudentInRotation($osceStase);

        // Jika ada mahasiswa berikutnya, kita tetap menggunakan Redirect::route
        // karena rute 'penguji.penilaian.edit' merender LivePenilaian
        return $this->redirectToNextRotation($osceStase, $nextEnrollment);
    }
    
    /**
     * TUGAS 3: POST /.../selesai (mengubah status sesi di osce_stase - Logika If/Else)
     */
    public function selesai($id_osce_stase)
    {
        $currentOsceStase = OsceStase::findOrFail($id_osce_stase);

        // 1. Cari semua stase yang berada pada SESI yang sama (Tanggal yang sama)
        $sessionStases = OsceStase::where('id_osce', $currentOsceStase->id_osce)
            ->whereDate('tanggal', $currentOsceStase->tanggal)
            ->get();
        
        $isSessionComplete = true;

        // 2. Iterasi dan Cek apakah ada satupun stase yang antriannya belum kosong
        foreach ($sessionStases as $stase) {
            $nextStudent = $this->findNextStudentInRotation($stase);
            if ($nextStudent) {
                $isSessionComplete = false;
                break;
            }
        }

        // 3. Status Response
        if ($isSessionComplete) {
            return response()->json([
                'status' => 'inactive',
                'message' => 'Sesi penilaian untuk tanggal ini telah selesai.'
            ], 200);
        } else {
            return response()->json([
                'status' => 'active',
                'message' => 'Masih ada mahasiswa yang belum dinilai di stase lain dalam sesi ini.'
            ], 200);
        }
    }

    /**
     * TUGAS 4: GET /penilaian/{id_enrollment_osce}/nilai (Mengambil Nilai yang Sudah Ada)
     */
    public function getNilai($id_enrollment_osce)
    {
        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);
        
        $osceStase = OsceStase::where('id_osce_stase', $enrollment->id_osce_stase)
            ->firstOrFail();
            
        // Ambil semua nilai mentah (skor 0-4) yang sudah tersimpan untuk enrollment ini
        $nilaiOsce = NilaiOsce::where('id_enrollment_osce', $id_enrollment_osce)
            ->get()
            ->map(function ($item) {
                return [
                    'id_poin_aspek_penilaian' => $item->id_poin_aspek_penilaian,
                    'skor' => $item->nilai, 
                ];
            });

        // Ambil catatan/feedback
        $catatan = $enrollment->catatan;

        return response()->json([
            'nilai' => $nilaiOsce,
            'catatan' => $catatan
        ]);
    }


    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * Mencari mahasiswa berikutnya di antrian (untuk stase tertentu).
     */
    private function findNextStudentInRotation(OsceStase $osceStase)
    {
        // 1. Ambil semua Enrollment OSCE ini
        $enrollments = EnrollmentOsce::where('id_osce', $osceStase->id_osce)
            ->orderBy('id_enrollment_osce', 'asc') 
            ->get();
            
        $targetStaseId = $osceStase->id_stase;

        // 2. Dapatkan semua ID Enrollment yang sudah dinilai di stase INI
        $submittedEnrollmentIds = NilaiOsce::whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($targetStaseId) {
            $q->where('id_stase', $targetStaseId); 
        })
        ->pluck('id_enrollment_osce')
        ->unique()
        ->toArray();
        
        // 3. Filter mahasiswa yang BELUM dinilai di stase ini
        $nextEnrollment = $enrollments->reject(function ($en) use ($submittedEnrollmentIds) {
            return in_array($en->id_enrollment_osce, $submittedEnrollmentIds);
        })->first();

        return $nextEnrollment;
    }

    /**
     * Mengarahkan ke rute penilaian mahasiswa berikutnya atau merender halaman rotasi selesai.
     */
    private function redirectToNextRotation(OsceStase $osceStase, $nextEnrollment = null)
    {
        if ($nextEnrollment === null) {
             $nextEnrollment = $this->findNextStudentInRotation($osceStase);
        }

        if ($nextEnrollment) {
            // Rotasi ADA mahasiswa berikutnya: Gunakan Redirect (PRG Pattern)
            // Redirect ini akan memicu 'penguji.penilaian.edit' yang merender LivePenilaian.jsx
            return Redirect::route('penguji.penilaian.edit', [
                'id_enrollment_osce' => $nextEnrollment->id_enrollment_osce 
            ])->with('success', 'Nilai berhasil disimpan. Silakan lanjutkan ke mahasiswa berikutnya.');

        } else {
            // Rotasi SELESAI: Gunakan Inertia::render() eksplisit seperti permintaan Anda
            // Asumsi: Halaman rekap/rotasi selesai ada di 'Penguji/LiveRotasi'
            $osce = $osceStase->osce; // Ambil data OSCE dari relasi
            
            return Inertia::render('Penguji/LiveRotasi', [
                'id_osce' => $osceStase->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
                'osce' => $osce,
                'stase' => $osceStase,
                'message' => 'Semua mahasiswa di stase ini telah dinilai.'
            ]);
        }
    }
}