<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\OsceEnrollmentService;
use App\Models\OsceStase; // <-- Perlu ini untuk referensi sesi

class OsceEnrollmentController extends Controller
{
    /**
     * TUGAS 1: Menampilkan halaman enrollment (PERBAIKAN)
     * GET /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     */
    protected $service;
    public function __construct(OsceEnrollmentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, $osce_id, $jadwal_id)
    {
        // 1. Ambil data OSCE
        $osce = Osce::findOrFail($osce_id);

        // 2. [FIX] Cari data Sesi (tanggal/jam) dari $jadwal_id
        //    ($jadwal_id adalah MIN(id_osce_stase) dari sesi tersebut)
        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
            ->where('id_osce_stase', $jadwal_id)
            ->firstOrFail();
        // 3. Ambil data filter
        $search = $request->query('search');
        $angkatan = $request->query('angkatan'); // 'angkatan' di React = 'kelas' di DB

        // 6. Paginate mahasiswa dan tambahkan properti 'is_enrolled'
        $mahasiswa_list = $this->service->getEnrollmentList(
            $osce_id,
            $jadwal_id,
            $request->only(['search', 'angkatan'])
        );
        // 7. [FIX] Kirim props yang benar ke React
        return Inertia::render('Admin/OsceEnrollmentPage', [
            'osce' => $osce,
            'sesi' => $sesi_ref, // Berisi tanggal & jam_mulai
            'mahasiswa_list' => $mahasiswa_list["data"], // Nama prop yang benar
            'filters' => ['search' => $search, 'angkatan' => $angkatan],
        ]);
    }

    /**
     * TUGAS 2: Menyimpan (sync) data enrollment (PERBAIKAN)
     * POST /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     */
    public function sync(Request $request, $osce_id, $jadwal_id)
    {
        // 1. Validasi
        $validated = $request->validate([
            'id_mahasiswa_array' => 'present|array', // 'present' berarti boleh kosong
            'id_mahasiswa_array.*' => 'integer|exists:mahasiswa,id_mahasiswa',
        ]);

        // 2. [FIX] Ambil data Sesi (tanggal/jam) dari $jadwal_id
        $result =  $this->service->syncEnrollment(
            $osce_id,
            $jadwal_id,
            $validated['id_mahasiswa_array']
        );

        $message = $result["message"];

        // [PERBAIKAN] Redirect ke halaman list jadwal, bukan back()
        if ($result["success"] === true) {
            return redirect()->route('admin.osce.jadwal.index', $osce_id)->with('success', $message);
        } else if ($result["success" === false]) {
            return redirect()->back()->with('error', $message);
        }
    }
}
