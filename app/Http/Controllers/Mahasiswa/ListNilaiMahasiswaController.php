<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan DB Facade

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswa;

        if (!$mahasiswa) {
            return redirect()->back()->with('error', 'Data mahasiswa tidak ditemukan');
        }

        $search = $request->input('q');
        $tahun = $request->input('tahun');
        $semester = $request->input('sem');

        // --- 1. Query Data Ujian (Enrollment OSCE) ---
        $ujian = EnrollmentOsce::query()
            ->where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->join('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')

            // Hitung Total Nilai
            ->addSelect(['nilai_total' => NilaiOsce::selectRaw('COALESCE(SUM(nilai), 0)')
                ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
            ])

            // Filter
            ->when($search, fn($q) => $q->where('osce.nama_osce', 'like', "%{$search}%"))
            ->when($tahun, fn($q) => $q->where('tahun_akademik.tahun', $tahun))
            ->when($semester, fn($q) => $q->where('tahun_akademik.semester', $semester))

            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label', // "Ganjil" / "Genap"
                'tahun_akademik.tahun as tahun_akademik',    // "2025/2026"
            ])
            ->orderBy('osce.tanggal_mulai', 'desc')
            ->paginate(10)
            ->withQueryString();


        // --- 2. Logic Mencari Tahun Masuk (ANGKATAN) ---
        
        // Strategi: Cari tahun akademik PALING AWAL di mana mahasiswa ini pernah terdaftar (di tabel enrollment umum)
        // Kita menggunakan tabel 'enrollment' (sesuai ERD), bukan 'enrollment_osce'
        $tahunMasukString = DB::table('enrollment')
            ->join('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'enrollment.id_tahun_akademik')
            ->where('enrollment.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderBy('tahun_akademik.tahun', 'asc') // Urutkan dari tahun terlama
            ->value('tahun_akademik.tahun'); // Ambil satu nilai pertama, misal "2023/2024"

        // Ambil 4 digit pertama (2023)
        // Jika tidak ada data enrollment sama sekali, gunakan tahun sekarang sebagai fallback
        $tahunMasuk = $tahunMasukString ? (int)substr($tahunMasukString, 0, 4) : (int)date('Y');


        // --- 3. Transformasi Data ---
        $ujian->getCollection()->transform(function ($item) use ($tahunMasuk) {
            
            // Ambil tahun ujian (misal "2025/2026" -> 2025)
            $tahunUjian = (int) substr($item->tahun_akademik, 0, 4);
            
            // Hitung selisih tahun
            // Contoh: Ujian 2025 - Masuk 2023 = Selisih 2 Tahun
            $selisihTahun = $tahunUjian - $tahunMasuk;
            
            // Rumus: (Selisih Tahun * 2) + (1 jika Ganjil, 2 jika Genap)
            // Contoh: (2 * 2) + 1 (Ganjil) = Semester 5
            $semesterAngka = ($selisihTahun * 2);
            $semesterAngka += ($item->semester_label === 'Ganjil') ? 1 : 2;

            // Penjagaan (Safety)
            if ($semesterAngka < 1) $semesterAngka = 1;

            // Override data
            $item->semester = (string) $semesterAngka;
            $item->status_lulus = $item->nilai_total >= 70;
            $item->dosen_penguji = '-'; 
            $item->tahun_ujian = $item->tahun_akademik;

            return $item;
        });

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi ?? 'Kedokteran',
                'status' => $mahasiswa->status ?? 'Aktif'
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