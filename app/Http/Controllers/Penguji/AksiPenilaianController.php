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
use Illuminate\Support\Carbon;

class AksiPenilaianController extends Controller
{
    /**
     * TUGAS 1: POST /penguji/penilaian/{id_enrollment_osce} (Simpan Nilai)
     * Logika: Wajib isi semua skor, menyimpan skor (0-4) di poin_aspek_penilaian,
     * dan membuat record di nilai_osce sebagai flag penyelesaian.
     */
    public function store(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        // 1. Ambil Data & Validasi Akses
        $enrollment = EnrollmentOsce::with('osce')->findOrFail($id_enrollment_osce);
        
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
            return back()->withErrors(['error' => 'Masa pengeditan/penilaian sudah berakhir.']);
        }
        
        // --- LOGIKA KRITIS: Validasi Kelengkapan Skor ---
        $totalPoinRubrik = PoinAspekPenilaian::whereHas('aspekPenilaian', function ($q) use ($osceStase) {
            $q->where('id_stase', $osceStase->id_stase);
        })->count();

        if (count($validated['nilai']) !== $totalPoinRubrik) {
            return back()->withErrors(['error' => 'Semua poin penilaian (' . $totalPoinRubrik . ' poin) harus diisi sebelum disimpan.']);
        }
        // --------------------------------------------------

        // 3. Simpan Data
        DB::transaction(function () use ($validated, $enrollment, $id_enrollment_osce) {
            
            // Simpan catatan/feedback
            $enrollment->catatan = $validated['catatan'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                // PART A: UPDATE MASTER DATA (POIN_ASPEK_PENILAIAN) dengan SKOR BARU (0-4)
                PoinAspekPenilaian::where('id_poin_aspek_penilaian', $item['id_poin_aspek_penilaian'])
                    ->update(['skor' => $item['skor']]);
                
                // PART B: INSERT/UPDATE FLAG (NILAI_OSCE)
                // Ini penting untuk validasi ROTASI dan perhitungan total skor.
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                         // Diisi 1 atau nilai dummy lain sebagai penanda bahwa record sudah dibuat
                         // dan siap untuk perhitungan (skor x bobot / 4) di logika lain.
                        'nilai' => 1, 
                    ]
                );
            }
        });

        // 4. Redirect ke mahasiswa berikutnya di antrian stase ini
        return $this->redirectToNextRotation($osceStase);
    }

    /**
     * TUGAS 2: GET /.../rotasi (mencari mahasiswa selanjutnya di antrian stase ini)
     */
    public function rotasi($id_osce_stase)
    {
        $osceStase = OsceStase::findOrFail($id_osce_stase);
        
        $nextEnrollment = $this->findNextStudentInRotation($osceStase);

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
    
    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * Mencari mahasiswa berikutnya di antrian (untuk stase tertentu).
     * Rotasi berdasarkan keberadaan record di NilaiOsce.
     */
    private function findNextStudentInRotation(OsceStase $osceStase)
    {
        // 1. Ambil semua Enrollment OSCE ini
        $enrollments = EnrollmentOsce::where('id_osce', $osceStase->id_osce)
            ->orderBy('id_enrollment_osce', 'asc') 
            ->get();
            
        $targetStaseId = $osceStase->id_stase;

        // 2. Dapatkan semua ID Enrollment yang sudah dinilai di stase INI (menggunakan NilaiOsce sebagai FLAG)
        // Mahasiswa dianggap "sudah dinilai" jika ada record NilaiOsce yang terikat ke poin aspek penilaian dari stase ini.
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
     * Mengarahkan ke rute penilaian mahasiswa berikutnya atau ke rekap jika antrian habis.
     */
    private function redirectToNextRotation(OsceStase $osceStase, $nextEnrollment = null)
    {
        if ($nextEnrollment === null) {
             $nextEnrollment = $this->findNextStudentInRotation($osceStase);
        }

        if ($nextEnrollment) {
            return redirect()->route('penguji.penilaian.edit', [
                'id_enrollment_osce' => $nextEnrollment->id_enrollment_osce 
            ])->with('success', 'Nilai berhasil disimpan. Silakan lanjutkan ke mahasiswa berikutnya.');

        } else {
            return redirect()->route('penguji.rekap.list', [
                'id_osce' => $osceStase->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase
            ])->with('success', 'Semua mahasiswa di stase ini telah dinilai.');
        }
    }
}