<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
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
        // [PERUBAHAN] Ambil SEMUA data OSCE tanpa pagination server-side
        // Kita gunakan Osce model langsung agar konsisten dengan halaman sebelumnya
        // Pastikan diload relasi 'tahunAkademik' agar filtering tahun berjalan lancar
        
        $osce = Osce::with('tahunAkademik')
            ->orderBy('created_at', 'desc')
            ->get();

        // Ambil data tahun akademik untuk dropdown
        $tahunAkademikOptions = TahunAkademik::orderBy('tahun', 'desc')
            ->get()
            ->map(fn($t) => [
                'label' => $t->tahun . ' - ' . $t->semester,
                'value' => $t->id_tahun_akademik
            ]);

        return Inertia::render('Admin/RekapOscePage', [
            'osce' => $osce, // Mengirim Array Full
            'tahunAkademikOptions' => $tahunAkademikOptions,
            'filters' => [], // Filter dikosongkan karena dihandle frontend
        ]);
    }


    /**
     * GET /admin/rekap-nilai/{id_osce}/sesi
     * List sesi berdasarkan tanggal dan jam untuk OSCE tertentu
     */
    public function listSesi(Request $request, $id_osce)
    {
        // $search = $request->input('search'); // Tidak perlu ambil dari request
        
        // Panggil Service TANPA parameter search
        $result = $this->service->getSesiList($id_osce);

        return Inertia::render('Admin/RekapSesiPage', [
            'osce' => $result['osce'],
            'sesi' => $result['sesi'], // Array Full
            'filters' => [], // Filter kosong
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
