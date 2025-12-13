<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

// Models
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\Osce;
use App\Models\OsceStase;

class AksiPenilaianController extends Controller
{
    /**
     * Helper: Cek Batas Waktu (Gatekeeper)
     * Menggunakan tanggal_selesai dari tabel OSCE (Per Event)
     */
    private function cekWaktuHabis($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        // Paksa Parse Tanggal Selesai sebagai WIB (Asia/Jakarta)
        $batasWaktu = Carbon::parse($osce->tanggal_selesai, 'Asia/Jakarta')->endOfDay();

        // Bandingkan dengan waktu sekarang di Jakarta juga
        return Carbon::now('Asia/Jakarta')->gt($batasWaktu);
    }

    /**
     * SIMPAN NILAI OSCE
     * POST: /penguji/penilaian/{id_enrollment_osce}
     */
    public function store(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        // 1. Ambil Data Enrollment
        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);

        // 2. Validasi Waktu
        if ($this->cekWaktuHabis($enrollment->id_osce)) {
            return back()->withErrors(['error' => 'Masa penilaian OSCE ini telah berakhir.']);
        }

        // 3. Validasi Input
        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer',
            'nilai.*.skor' => 'required|integer|min:0|max:4',
            'feedback' => 'nullable|string',
        ]);

        // 4. Ambil Context Stase (Penting untuk Redirect nanti)
        // Kita cari stase mana yang sedang dipegang oleh penguji ini di OSCE ini
        $staseContext = OsceStase::where('id_osce', $enrollment->id_osce)
            ->where('id_penguji', $user->penguji->id_penguji)

            // TAMBAHKAN FILTER WAKTU AGAR TIDAK SALAH AMBIL JADWAL PENGUJI
            ->whereDate('tanggal', $enrollment->tanggal_sesi)
            ->whereTime('jam_mulai', '<=', $enrollment->jam_sesi)
            ->whereTime('jam_selesai', '>', $enrollment->jam_sesi)

            ->firstOrFail();

        // 5. Simpan Data (Gunakan Transaction)
        DB::transaction(function () use ($validated, $id_enrollment_osce, $enrollment) {
            // A. Simpan Feedback ke Enrollment
            $enrollment->catatan = $validated['feedback'] ?? null;
            $enrollment->save();

            // B. Simpan Skor ke tabel TRANSAKSI (NilaiOsce), BUKAN Master (PoinAspek)
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

        // 6. Redirect ke Halaman Rotasi
        return redirect()->route('penguji.rotasi', [
            'id_osce' => $enrollment->id_osce,
            'id_osce_stase' => $staseContext->id_osce_stase
        ])->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * HALAMAN ROTASI (GET)
     * Mencari mahasiswa selanjutnya dan menampilkan halaman tunggu.
     * Endpoint: /penguji/osce/{id_osce}/stase/{id_osce_stase}/rotasi
     */
    public function rotasi($id_osce, $id_osce_stase)
    {
        $user = Auth::user();
        $penguji = $user->penguji;

        // 1. Ambil & Validasi Stase
        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $penguji->id_penguji)
            ->firstOrFail();

        // 2. Filter Mahasiswa Sesi Ini (Range Waktu)
        $tglJadwal   = $osceStase->tanggal;
        $jamMulai    = $osceStase->jam_mulai;
        $jamSelesai  = $osceStase->jam_selesai;

        // [FIX LOGIKA]
        // Gunakan '<=' agar mahasiswa yang dijadwalkan tepat di jam selesai (edge case) tetap terbaca.
        // Risiko: Mahasiswa sesi berikutnya mungkin terbaca, tapi akan kita handle di logika "next".
        $allEnrollments = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->whereDate('tanggal_sesi', $tglJadwal)
            ->whereTime('jam_sesi', '>=', $jamMulai)
            ->whereTime('jam_sesi', '<', $jamSelesai) // <--- UBAH JADI <= (Kurang Dari Sama Dengan)
            ->orderBy('jam_sesi', 'asc')
            ->get();

        // 3. Cek yang sudah dinilai (DENGAN PERBAIKAN)
        $sudahDinilaiIds = NilaiOsce::whereIn('id_enrollment_osce', $allEnrollments->pluck('id_enrollment_osce'))
            ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                $q->where('id_stase', $osceStase->id_stase);
            })
            // --- TAMBAHKAN BARIS INI ---
            ->whereNotNull('nilai') // Hanya hitung jika skor benar-benar sudah diisi
            // ---------------------------
            ->pluck('id_enrollment_osce')
            ->toArray();

        // 4. Cari Next Student
        // Sekarang Foster tidak akan masuk ke $sudahDinilaiIds karena nilainya masih NULL
        // Jadi dia akan terpilih sebagai $nextStudent.
        $currentRequestTime = Carbon::now()->format('H:i:s');

        // OPSI A: Cari mahasiswa yang belum dinilai DAN jadwalnya >= sekarang (atau toleransi sedikit)
        $nextStudent = $allEnrollments->first(function ($enrollment) use ($sudahDinilaiIds, $currentRequestTime) {
            // Abaikan yang sudah dinilai
            if (in_array($enrollment->id_enrollment_osce, $sudahDinilaiIds)) {
                return false;
            }

            // (Opsional) Jika ingin memaksa urutan waktu:
            // return $enrollment->jam_sesi >= $currentRequestTime;

            // Tapi untuk keamanan (takut jam server beda), kembalikan saja logika dasar:
            return true;
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
            'mahasiswa_selanjutnya' => $mahasiswaSelanjutnya, // Akan NULL jika habis
            'sisa_waktu_rotasi_detik' => 60
        ]);
    }

    /**
     * HALAMAN KONFIRMASI SELESAI (GET)
     * Menampilkan list mahasiswa sebelum submit final.
     */
    public function halamanKonfirmasi($id_osce, $id_osce_stase)
    {
        $user = Auth::user();

        $osceStase = OsceStase::with(['osce', 'stase'])
            ->where('id_osce', $id_osce)
            ->where('id_osce_stase', $id_osce_stase)
            ->where('id_penguji', $user->penguji->id_penguji)
            ->firstOrFail();

        // ============================================================
        // PERBAIKAN LOGIKA: FILTER HANYA MAHASISWA SESI INI
        // ============================================================
        $tglJadwal   = $osceStase->tanggal;
        $jamMulai    = $osceStase->jam_mulai;
        $jamSelesai  = $osceStase->jam_selesai;

        // Ambil rekap singkat status penilaian (HANYA SESI INI)
        $mahasiswaList = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            // Tambahkan Filter Waktu Ini!
            ->whereDate('tanggal_sesi', $tglJadwal)
            ->whereTime('jam_sesi', '>=', $jamMulai)
            ->whereTime('jam_sesi', '<', $jamSelesai)
            ->orderBy('jam_sesi', 'asc')
            ->get()
            ->map(function ($enrollment) use ($osceStase) {
                $hasNilai = NilaiOsce::where('id_enrollment_osce', $enrollment->id_enrollment_osce)
                    ->whereHas('poinAspekPenilaian.aspekPenilaian', function ($q) use ($osceStase) {
                        $q->where('id_stase', $osceStase->id_stase);
                    })->exists();

                return [
                    'nama'   => $enrollment->mahasiswa->nama,
                    'nim'    => $enrollment->mahasiswa->nim,
                    'status' => $hasNilai ? 'Sudah Dinilai' : 'Belum Dinilai',
                ];
            });

        return Inertia::render('Penguji/SubmitRubrik', [
            'osce_detail' => [
                'id_osce'       => $osceStase->id_osce,
                'id_osce_stase' => $osceStase->id_osce_stase,
                'nama_osce'     => $osceStase->osce->nama_osce,
                'nama_stase'    => $osceStase->stase->nama_stase,
            ],
            'mahasiswa_list' => $mahasiswaList
        ]);
    }

    /**
     * AKSI SELESAI SESI (POST)
     * Hanya redirect ke dashboard, karena status dikontrol waktu admin.
     */
    public function selesai($id_osce, $id_osce_stase)
    {
        // Tidak ada update DB.
        return redirect()->route('penguji.dashboard')
            ->with('success', 'Sesi penilaian telah diselesaikan. Anda akan diarahkan ke Dashboard.');
    }
}