<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\Auth;

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswaId = Auth::user()->id; // atau ambil dari tabel mahasiswa jika beda user table

        // Ambil query parameter (harus sinkron dengan frontend)
        $search = $request->q;
        $tahun = $request->tahun;
        $semester = $request->sem;

        // Query OSCE History
        $ujian = EnrollmentOsce::query()
            ->where('mahasiswa_id', $mahasiswaId)
            ->join('osce', 'osce.id', '=', 'enrollment_osce.osce_id')
            ->join('tahun_akademik', 'tahun_akademik.id', '=', 'osce.tahun_akademik_id')

            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('osce.nama', 'like', "%$search%")
                      ->orWhere('osce.dosen_penguji', 'like', "%$search%");
                });
            })

            ->when($tahun, fn($q) => $q->where('tahun_akademik.tahun', $tahun))

            ->when($semester, fn($q) => $q->where('osce.semester', $semester))

            ->select([
                'enrollment_osce.id',
                'osce.nama as nama_ujian',
                'osce.dosen_penguji',
                'osce.tanggal_ujian',
                'osce.semester',
                'tahun_akademik.tahun as tahun_ujian',
                'enrollment_osce.status_lulus', // boolean data
            ])

            ->orderBy('osce.tanggal_ujian', 'desc')
            ->paginate(10)
            ->withQueryString(); // Agar filter tetap saat pagination

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama' => Auth::user()->name,
                'nim'  => Auth::user()->nim ?? '-',
                'prodi'=> Auth::user()->prodi ?? '-',
                'status'=> 'Aktif'
            ],
            'ujian' => $ujian,
            'filters' => [
                'q' => $search,
                'tahun' => $tahun,
                'sem' => $semester,
            ]
        ]);
    }
}
