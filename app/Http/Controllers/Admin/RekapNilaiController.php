<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use PhpOffice\PhpSpreadsheet\Writer\Pdf;
use App\Services\Admin\RekapNilaiService; // Import Service

class RekapNilaiController extends Controller
{
    protected $service;

    // Pastikan Service di-inject di constructor
    public function __construct(RekapNilaiService $rekapNilaiService)
    {
        $this->service = $rekapNilaiService;
    }

    /**
     * GET /admin/rekap-nilai
     * List OSCE untuk rekap nilai
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun');

        // ✅ Panggil Service untuk mengambil data OSCE dan Tahun Akademik
        $result = $this->service->getRekapList($search, $tahun);

        return Inertia::render('Admin/RekapOscePage', [
            'osce' => $result['osce'], // Paginator Object
            'filters' => $request->only(['search', 'tahun']),
            'tahunAkademikOptions' => $result['tahunAkademikOptions'],
        ]);
    }


    /**
     * GET /admin/rekap-nilai/{id_osce}/sesi
     * List sesi berdasarkan tanggal dan jam untuk OSCE tertentu
     */
    public function listSesi(Request $request, $id_osce)
    {
        $search = $request->input('search');

        // ✅ Panggil Service
        $result = $this->service->getSesiList($id_osce, $search);

        return Inertia::render('Admin/RekapSesiPage', [
            'osce' => $result['osce'],
            'sesi' => $result['sesi'],
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * TUGAS 1
     * Endpoint: GET /admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa
     * Menampilkan daftar mahasiswa yang terdaftar pada sesi tertentu
     */
    public function listMahasiswaPerStase(Request $request, $id_osce, $id_sesi)
    {
        $search = $request->input('search');
        $angkatan = $request->input('angkatan');

        // ✅ Panggil Service
        $result = $this->service->getMahasiswaPerSesi($id_osce, $id_sesi, $search, $angkatan);

        return Inertia::render('Admin/RekapMahasiswaPage', [
            'osce' => $result['osce'],
            'sesi' => $result['sesi_info'],
            'mahasiswa_list' => $result['mahasiswa_list'],
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * TUGAS 2
     * GET /admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}
     * Menampilkan detail nilai mahasiswa per stase.
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        // ✅ Panggil Service untuk perhitungan
        $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

        if (!$detailNilai) {
            abort(404, 'Data mahasiswa untuk OSCE ini tidak ditemukan.');
        }

        return Inertia::render('Admin/RekapDetailPage', [
            'detailNilai' => $detailNilai,
        ]);
    }

    /**
     * TUGAS 3: DOWNLOAD PDF
     * GET /admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}/download
     */
    public function downloadPdf($id_mahasiswa, $id_osce)
    {
        // ✅ Panggil Service untuk perhitungan
        $detailNilai = $this->service->calculateDetailNilai($id_mahasiswa, $id_osce);

        if (!$detailNilai) {
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