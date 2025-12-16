<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\Osce;
use Inertia\Inertia; // Dipertahankan, tetapi tidak digunakan di semua method
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use App\Services\Admin\RekapNilaiService;

class RekapNilaiController extends Controller
{
    protected $service;

    public function __construct(RekapNilaiService $rekapNilaiService)
    {
        $this->service = $rekapNilaiService;
    }

    /**
     * List OSCE untuk rekap nilai
     */
    public function index(Request $request)
    {
        $osce = Osce::with('tahunAkademik')
            ->orderBy('created_at', 'desc')
            ->get();

        $tahunAkademikOptions = TahunAkademik::orderBy('tahun', 'desc')
            ->get()
            ->map(fn($t) => [
                'label' => $t->tahun . ' - ' . $t->semester,
                'value' => $t->id_tahun_akademik
            ]);

        // --- DIUBAH DARI Inertia::render MENJADI response()->json ---
        return response()->json([
            'osce' => $osce,
            'tahunAkademikOptions' => $tahunAkademikOptions,
            'filters' => [],
        ]);
        // -----------------------------------------------------------------
    }


    /**
     * List sesi berdasarkan tanggal dan jam untuk OSCE tertentu
     */
    public function listSesi(Request $request, $id_osce)
    {
        $search = $request->input('search');

        // Panggil Service (Service tidak diubah)
        $result = $this->service->getSesiList($id_osce, $search);

        // --- DIUBAH DARI Inertia::render MENJADI response()->json ---
        return response()->json([
            'osce' => $result['osce'],
            'sesi' => $result['sesi'],
            'filters' => $request->only(['search']),
        ]);
        // -----------------------------------------------------------------
    }

    /**
     * Menampilkan daftar mahasiswa yang terdaftar pada sesi tertentu
     */
    public function listMahasiswaPerStase(Request $request, $id_osce, $id_sesi)
    {
        $search = $request->input('search');
        $angkatan = $request->input('angkatan');

        // Panggil Service (Service tidak diubah)
        $result = $this->service->getMahasiswaPerSesi($id_osce, $id_sesi, $search, $angkatan);

        // --- DIUBAH DARI Inertia::render MENJADI response()->json ---
        return response()->json([
            'osce' => $result['osce'],
            'sesi_info' => $result['sesi_info'],
            'mahasiswa_list' => $result['mahasiswa_list'],
            'filters' => $request->only(['search', 'angkatan']),
        ]);
        // -----------------------------------------------------------------
    }

    /**
     * Menampilkan detail nilai mahasiswa per stase.
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        // Panggil Service untuk perhitungan (Service tidak diubah)
        $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

        if (!$detailNilai) {
            // Mengubah abort(404) menjadi response JSON 404
            return response()->json([
                'message' => 'Data mahasiswa untuk OSCE ini tidak ditemukan.'
            ], 404);
        }

        // --- DIUBAH DARI Inertia::render MENJADI response()->json ---
        return response()->json([
            'detailNilai' => $detailNilai,
        ]);
        // -----------------------------------------------------------------
    }

    /**
     * TUGAS 3: DOWNLOAD PDF (Endpoint ini tetap menghasilkan file PDF)
     */
    public function downloadPdf($id_mahasiswa, $id_osce)
    {
        // Panggil Service untuk perhitungan (Service tidak diubah)
        $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

        if (!$detailNilai) {
            // Mengubah Redirect::back() menjadi response JSON dengan error (atau response()->back() jika ini masih route web)
            // Karena ini adalah endpoint download PDF, kita biarkan Redirect::back() agar kembali ke halaman sebelumnya dengan pesan error.
            return Redirect::back()->with('error', 'Data mahasiswa untuk PDF tidak ditemukan.');
        }

        // Persiapkan Data untuk View PDF
        $data = $detailNilai;
        $data['tahun'] = date('Y'); // Tambahkan tahun saat ini untuk kebutuhan PDF

        // Generate PDF
        $pdf = Pdf::loadView('pdf.rekap_nilai', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('Hasil_OSCE_' . $detailNilai['mahasiswa']['nim'] . '.pdf');
    }
}
