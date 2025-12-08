<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentOsce;
use App\Models\Mahasiswa; 
use Illuminate\Support\Facades\Auth; // Wajib import Auth
use Illuminate\Support\Facades\DB;

class ListNilaiMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        // 1. AMBIL SIAPA YANG SEDANG LOGIN
        $user = Auth::user(); // Ini mengambil data dari tabel 'pengguna'

        // 2. CARI DATA MAHASISWA BERDASARKAN USER YANG LOGIN
        // Logika: Cari di tabel 'mahasiswa' yang kolom 'id_pengguna'-nya sama dengan ID user saat ini
        $mahasiswa = Mahasiswa::where('id_pengguna', $user->id_pengguna)->first();

        // --- PENTING: PENGECEKAN DATA ---
        // Jika User login (misal Admin atau User baru) tapi datanya BELUM dimasukkan ke tabel mahasiswa
        if (!$mahasiswa) {
            // Kita return data kosong agar web tidak error (Layar Putih)
            // Nanti di layar akan muncul Nama User tapi datanya strip (-)
            return Inertia::render('Mahasiswa/NilaiIndex', [
                'mahasiswa' => [
                    'nama'   => $user->username . ' (Belum terhubung ke Data Mahasiswa)',
                    'nim'    => '-',
                    'prodi'  => '-',
                    'status' => 'Data Tidak Ditemukan'
                ],
                'ujian' => [
                    'data' => [],
                    'links' => [],
                    'total' => 0
                ],
                'filters' => []
            ]);
        }

        // 3. JIKA DATA MAHASISWA KETEMU, BARU KITA AMBIL NILAINYA
        $search = $request->input('q');
        $tahun = $request->input('tahun');
        $semester = $request->input('sem');

        $ujian = EnrollmentOsce::query()
            ->where('enrollment_osce.id_mahasiswa', $mahasiswa->id_mahasiswa) // Filter punya dia saja
            ->join('osce', 'osce.id_osce', '=', 'enrollment_osce.id_osce')
            ->leftJoin('tahun_akademik', 'tahun_akademik.id_tahun_akademik', '=', 'osce.id_tahun_akademik')
            ->addSelect(['nilai_total' => DB::table('nilai_osce')
                ->selectRaw('COALESCE(SUM(nilai), 0)')
                ->whereColumn('id_enrollment_osce', 'enrollment_osce.id_enrollment_osce')
                ->limit(1)
            ])
            ->when($search, fn($q) => $q->where('osce.nama_osce', 'like', "%{$search}%"))
            ->when($tahun, fn($q) => $q->where('tahun_akademik.tahun', $tahun))
            ->when($semester, fn($q) => $q->where('tahun_akademik.semester', $semester))
            ->select([
                'enrollment_osce.id_enrollment_osce as id',
                'osce.nama_osce as nama_ujian',
                'osce.tanggal_mulai as tanggal_ujian',
                'tahun_akademik.semester as semester_label',
                'tahun_akademik.tahun as tahun_akademik',
            ])
            ->orderBy('osce.tanggal_mulai', 'desc')
            ->paginate(10)
            ->withQueryString();

        // 4. LOGIKA TAMBAHAN (Formatting)
        // Ambil tahun masuk dari NIM atau created_at (Contoh logika sederhana)
        $tahunMasuk = (int)date('Y') - 2; 

        $ujian->getCollection()->transform(function ($item) use ($tahunMasuk) {
            $tahunAkademik = $item->tahun_akademik ?? date('Y') . "/" . (date('Y')+1);
            $semLabel = $item->semester_label ?? 'Ganjil';
            
            // Hitung semester angka
            $tahunUjian = (int) substr($tahunAkademik, 0, 4);
            $selisih = $tahunUjian - $tahunMasuk;
            $semAngka = ($selisih * 2) + ($semLabel === 'Ganjil' ? 1 : 2);
            if($semAngka < 1) $semAngka = 1;

            $item->semester = (string) $semAngka;
            $item->status_lulus = $item->nilai_total >= 70;
            $item->dosen_penguji = '-';
            $item->tahun_ujian = $tahunAkademik;

            return $item;
        });

        return Inertia::render('Mahasiswa/NilaiIndex', [
            'mahasiswa' => [
                'nama'   => $mahasiswa->nama,
                'nim'    => $mahasiswa->nim,
                'prodi'  => $mahasiswa->prodi,
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