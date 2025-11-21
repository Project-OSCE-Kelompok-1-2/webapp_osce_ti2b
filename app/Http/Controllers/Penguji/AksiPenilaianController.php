<?php

namespace App\Http\Controllers\Penguji;

use App\Models\EnrollmentOsce;
use App\Models\PoinAspekPenilaian;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AksiPenilaianController extends Controller
{
    /**
     * Mengecek apakah OSCE sudah berakhir.
     */
    private function cekOsceSelesai($id_osce)
    {
        // Mengambil data OSCE berdasarkan ID
        $osce = Osce::findOrFail($id_osce);

        // Mengecek apakah tanggal selesai OSCE sudah lewat
        return now()->greaterThan($osce->tanggal_selesai);
    }

    /**
     * SIMPAN NILAI OSCE
     * POST: /penguji/penilaian/{id_enrollment_osce}
     */
    public function simpanNilai(Request $request, $id_enrollment_osce)
    {
        // Mengambil enrollment mahasiswa OSCE
        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);

        // OSCE sudah selesai → nilai tidak boleh diubah
        if ($this->cekOsceSelesai($enrollment->id_osce)) {
            return redirect()->back()->with('error', 'OSCE telah berakhir. Tidak dapat menyimpan atau mengubah nilai.');
        }

        // Validasi input nilai yang dikirim oleh penguji
        $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer|exists:poin_aspek_penilaian,id_poin_aspek_penilaian',
            'nilai.*.skor' => 'required|numeric|min:0|max:100'
        ]);

        // Update skor langsung di tabel poin_aspek_penilaian
        foreach ($request->nilai as $item) {
            // Menyimpan skor yang diinput penguji ke database
            PoinAspekPenilaian::where('id_poin_aspek_penilaian', $item['id_poin_aspek_penilaian'])
                ->update(['skor' => $item['skor']]);
        }

        // Mengembalikan response sukses agar front-end bisa menampilkan notifikasi
        return redirect()->route('penguji.rotasi', [
            'id_osce' => $enrollment->id_osce,
            'id_osce_stase' => $enrollment->id_osce_stase,
        ])->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * ROTASI STASE
     */
    public function rotasi($id_osce_stase)
    {
        // Mengambil stase saat ini
        $staseSekarang = OsceStase::findOrFail($id_osce_stase);

        // OSCE sudah selesai → rotasi tidak bisa dilakukan
        if ($this->cekOsceSelesai($staseSekarang->id_osce)) {
            return redirect()->back()->with('error', 'OSCE telah berakhir, rotasi tidak dapat dilakukan.');
        }

        // Ambil semua stase OSCE ini berdasarkan jadwal
        $staseList = OsceStase::where('id_osce', $staseSekarang->id_osce)
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->get()
            ->values();

        // Cari index stase saat ini
        $currentIndex = $staseList->search(fn($s) => $s->id_osce_stase == $id_osce_stase);

        // Ambil stase berikutnya (jika ada)
        $nextStase = $staseList->get($currentIndex + 1);

        // Ambil semua mahasiswa yang ikut OSCE ini
        $mahasiswa = EnrollmentOsce::where('id_osce', $staseSekarang->id_osce)->get();

        // Kembalikan data agar front-end bisa menampilkan rotasi dan daftar mahasiswa
        return redirect()->back()->with([
            'message' => 'Rotasi berhasil.',
            'stase_sekarang' => $staseSekarang,
            'stase_berikutnya' => $nextStase,
            'jumlah_mahasiswa' => $mahasiswa->count(),
        ]);
    }

    /**
     * SELESAI SESI
     */
    public function selesaiSesi($id_osce_stase)
    {
        // Ambil stase yang dimaksud
        $stase = OsceStase::findOrFail($id_osce_stase);

        // Cek apakah OSCE sudah selesai
        if ($this->cekOsceSelesai($stase->id_osce)) {
            return redirect()->back()->with('error', 'OSCE telah berakhir. Sesi tidak dapat diubah.');
        }

        // Response sukses agar front-end menandai sesi selesai
        return redirect()->back()->with('success', 'Sesi berhasil ditandai sebagai selesai.');
    }
}