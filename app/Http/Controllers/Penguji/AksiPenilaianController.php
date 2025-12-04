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
use Inertia\Inertia;
use App\Models\Osce; // <<< WAJIB: Import Model OSCE yang hilang

class AksiPenilaianController extends Controller
{
    // ... (Fungsi cekWaktuHabis tidak diubah, asumsikan model OSCE sudah di-import di atas)

    /**
     * SIMPAN NILAI OSCE
     * POST: /penguji/penilaian/{id_enrollment_osce}
     */
    public function store(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        // 1. Ambil Data Enrollment
        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);
        $osce = $enrollment->osce; // Ambil object OSCE dari relasi

        // 2. Validasi Waktu (Hanya perlu satu cek waktu)
        if (Carbon::now('Asia/Jakarta')->gt(Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay())) {
            return back()->withErrors(['error' => 'Masa penilaian OSCE ini telah berakhir.']);
        }
        
        // 3. Validasi Input (Hanya sekali)
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0|max:4',
            'catatan' => 'nullable|string', // Menggunakan 'catatan' sesuai validasi kedua Anda
        ]);

        // 4. Ambil Context Stase (Penting untuk mendapatkan id_stase & Redirect nanti)
        $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)
            ->firstOrFail(); // <<< Variabel DIUBAH menjadi $osceStase

        // --- LOGIKA KRITIS: Validasi Kelengkapan Skor ---
        $totalPoinRubrik = PoinAspekPenilaian::whereHas('aspekPenilaian', function ($q) use ($osceStase) {
            $q->where('id_stase', $osceStase->id_stase); // Menggunakan $osceStase
        })->count();

        if (count($validated['nilai']) !== $totalPoinRubrik) {
            return Redirect::back()->withErrors(['error' => 'Semua poin penilaian (' . $totalPoinRubrik . ' poin) harus diisi sebelum disimpan.']);
        }
        // --------------------------------------------------
        
        // 5. Simpan Data
        DB::transaction(function () use ($validated, $enrollment, $id_enrollment_osce) {
            
            // Simpan catatan/feedback
            $enrollment->catatan = $validated['catatan'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                
                // HAPUS PART A: UPDATE MASTER DATA (POIN_ASPEK_PENILAIAN)
                // Karena PoinAspekPenilaian adalah MASTER data, tidak seharusnya di-update skornya di sini.
                /*
                PoinAspekPenilaian::where('id_poin_aspek_penilaian', $item['id_poin_aspek_penilaian'])
                    ->update(['skor' => $item['skor']]); 
                */
                
                // PART B: INSERT/UPDATE NILAI MENTAH (NILAI_OSCE)
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor'], 
                    ]
                );
            }
        });

        // 6. Redirect ke mahasiswa berikutnya di antrian stase ini
        return $this->redirectToNextRotation($osceStase);
    }

    /**
     * TUGAS 2: GET /.../rotasi (mencari mahasiswa selanjutnya di antrian stase ini)
     */
    public function rotasi($id_osce_stase)
    {
        $user = Auth::user(); // <<< AMBIL USER YANG LOGIN
        $penguji = $user->penguji; // Asumsi ada relasi ke Model Penguji

        // 1. Ambil & Validasi Stase (Menggunakan $id_osce_stase dari parameter)
        $osceStase = OsceStase::with(['osce', 'stase'])
            // Hapus filter id_osce karena kita sudah filter by id_osce_stase (Primary Key)
            ->where('id_osce_stase', $id_osce_stase) 
            ->where('id_penguji', $penguji->id_penguji) // <<< Gunakan $penguji yang sudah didefinisikan
            ->firstOrFail();

        // Variabel untuk memudahkan
        $id_osce    = $osceStase->id_osce;
        $tglJadwal  = $osceStase->tanggal;
        $jamMulai   = $osceStase->jam_mulai;
        $jamSelesai = $osceStase->jam_selesai;

        // 2. Filter Mahasiswa Sesi Ini (Range Waktu)
        $allEnrollments = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tglJadwal)
            ->whereTime('jam_sesi', '>=', $jamMulai)
            ->whereTime('jam_sesi', '<', $jamSelesai) 
            ->orderBy('jam_sesi', 'asc')
            ->get();
        
        // 3. Cek yang sudah dinilai
        $sudahDinilaiIds = NilaiOsce::whereIn('id_enrollment_osce', $allEnrollments->pluck('id_enrollment_osce'))
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            ->whereNotNull('nilai') 
            ->pluck('id_enrollment_osce')
            ->unique() // Tambahkan unique agar tidak ada duplikasi
            ->toArray();

        // 4. Cari Next Student (Logika yang lebih aman)
        $nextStudent = $allEnrollments->first(function ($enrollment) use ($sudahDinilaiIds) {
            // Mahasiswa berikutnya adalah yang belum ada di daftar ID yang sudah dinilai
            return !in_array($enrollment->id_enrollment_osce, $sudahDinilaiIds);
        });

        $mahasiswaSelanjutnya = null;
        if ($nextStudent) {
            $mahasiswaSelanjutnya = [
                'id_enrollment_osce' => $nextStudent->id_enrollment_osce,
                'nama' => $nextStudent->mahasiswa->nama,
                'nim' => $nextStudent->mahasiswa->nim,
                'prodi' => $nextStudent->mahasiswa->prodi,
            ];
        }

        return Inertia::render('Penguji/LiveRotasi', [
            'osce_detail' => [
                'id_osce' => $osceStase->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
                'nama_osce' => $osceStase->osce->nama_osce,
                'nama_stase' => $osceStase->stase->nama_stase,
            ],
            'mahasiswa_selanjutnya' => $mahasiswaSelanjutnya, 
            'sisa_waktu_rotasi_detik' => 60
        ]);
    }

    // ... (Fungsi getNilai dan Helper Function lainnya)
    
}