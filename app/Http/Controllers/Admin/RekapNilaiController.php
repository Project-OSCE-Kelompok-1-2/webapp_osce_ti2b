<?php

namespace App\Http\Controllers\Admin;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use App\Models\NilaiOsce;
use App\Models\OsceStase;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\TahunAkademik; // <-- TAMBAHAN: untuk dropdown tahun akademik

class RekapNilaiController extends Controller
{
    /**
     * GET /admin/rekap-nilai
     * List OSCE untuk rekap nilai
     */
    public function index(Request $request)
    {
        $query = Osce::with('tahunAkademik');

        if ($search = $request->input('search')) {
            $query->where('nama_osce', 'like', "%{$search}%");
        }

        if ($tahun = $request->input('tahun')) {
            $query->whereHas('tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', $tahun);
            });
        }

        // Gunakan paginate agar tersedia struktur 'data'
        $osces = $query->paginate(10)->through(function ($osce) {
            return [
                'id_osce'          => $osce->id_osce,
                'nama_rubrik'      => $osce->nama_osce,
                'rentang_tanggal'  => $osce->tanggal_mulai . ' - ' . $osce->tanggal_selesai,
                'tahun_akademik'   => optional($osce->tahunAkademik)->tahun,
                // menyesuakan dengan test
                // 'detail_mahasiswa' => $osce->enrollmentOsce()->count() . ' mahasiswa',
                // 'detail_sesi'      => $osce->osceStase()->count() . ' sesi',
            ];
        });

        // === TAMBAHAN: Ambil list tahun akademik untuk dropdown (dinamis) ===
        $tahunAkademikOptions = TahunAkademik::orderBy('tahun', 'desc')
            ->get()
            ->map(function ($t) {
                return [
                    // gunakan string tahun sebagai value supaya sesuai filter di query ->where('tahun', $tahun)
                    'value' => $t->tahun,
                    'label' => $t->tahun,
                ];
            });

        // Sesuai test: key = 'osce', bukan 'osces'
        return Inertia::render('Admin/RekapOscePage', [
            'osce' => $osces,
            'filters' => $request->only(['search', 'tahun']),
            'tahunAkademikOptions' => $tahunAkademikOptions, // <-- kirim ke frontend
        ]);
    }


    /**
     * GET /admin/rekap-nilai/{id_osce}/sesi
     * List sesi berdasarkan tanggal untuk OSCE tertentu
     */
public function listSesi(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $search = $request->input('search');

        $query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal');

        if ($search) {
            $query->where('tanggal', 'like', "%{$search}%");
        }

        // PERBAIKAN: Group by Tanggal DAN Jam Mulai
        $sesi_paginated = $query->select(
                'tanggal', 
                'jam_mulai', // Tambahkan jam_mulai
                DB::raw('COUNT(*) as stase_count')
            )
            ->groupBy('tanggal', 'jam_mulai') // Group dua kolom
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc') // Urutkan jam juga
            ->paginate(10)
            ->withQueryString();

        $sesi_data = $sesi_paginated->through(function ($sesi_group) use ($id_osce) {
            
            // Hitung mahasiswa unik untuk (tanggal + jam) ini
            // Perlu disesuaikan logicnya jika enrollment juga mencatat jam, 
            // Jika enrollment hanya tanggal, maka angka ini mungkin kurang akurat per jam.
            // ASUMSI: EnrollmentOsce punya kolom 'jam_sesi' atau mirip.
            // Jika tidak, kita gunakan filter tanggal saja dulu.
            
            $mahasiswaQuery = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi_group->tanggal);
                
            // OPTIONAL: Jika tabel enrollment_osce punya jam, tambahkan filter ini:
            // ->where('jam_sesi', $sesi_group->jam_mulai)

            $jumlah_mahasiswa = $mahasiswaQuery->distinct('id_mahasiswa')->count();

            // Format Jam (hapus detik jika ada, misal 08:00:00 -> 08:00)
            $jam_formatted = substr($sesi_group->jam_mulai, 0, 5); 

            return [
                // ID Sesi gabungan agar unik di URL
                'id_sesi' => $sesi_group->tanggal . '_' . str_replace(':', '', $jam_formatted), 
                
                // Kirim data terpisah agar fleksibel di frontend
                'tanggal_sesi_raw' => $sesi_group->tanggal,
                'jam_sesi_raw' => $jam_formatted,
                
                // Format gabungan untuk tampilan
                'tampilan_sesi' => (new \DateTime($sesi_group->tanggal))->format('d M Y') . ' — Pukul ' . $jam_formatted,
                
                'jumlah_mahasiswa' => $jumlah_mahasiswa,
            ];
        });

        return Inertia::render('Admin/RekapSesiPage', [
            'osce' => $osce,
            'sesi' => $sesi_data,
            'filters' => $request->only(['search']),
        ]);
    }
    /**
     * TUGAS 1
     * Endpoint: GET /admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa
     * Menampilkan daftar mahasiswa yang terdaftar pada sesi (id_osce_stase) tertentu
     */
    public function listMahasiswaPerStase(Request $request, $id_osce, $id_sesi)
    {
        // [BAGIAN BARU] 1. MEMECAH ID_SESI
        // Format id_sesi dari URL adalah: "2025-12-04_1456" (Tanggal_Jam)
        // Kita harus pisahkan agar PHP bisa membaca Tanggalnya saja.
        
        $parts = explode('_', $id_sesi); // Pecah berdasarkan garis bawah (_)
        $sesi_tanggal = $parts[0]; // Ambil bagian depan: "2025-12-04"
        
        // Ambil jam (bagian belakang) untuk keperluan tampilan
        $sesi_jam_raw = isset($parts[1]) ? $parts[1] : ''; 
        
        // Format jam agar cantik (misal 1456 menjadi 14:56)
        $sesi_jam_display = '';
        if (strlen($sesi_jam_raw) == 4) {
            $sesi_jam_display = substr($sesi_jam_raw, 0, 2) . ':' . substr($sesi_jam_raw, 2, 2);
        }

        // 2. Ambil data OSCE
        $osce = Osce::findOrFail($id_osce);

        // 3. Filter Query
        $search = $request->input('search');
        $angkatan = $request->input('angkatan'); 

        // 4. Query Enrollment (Filter berdasarkan Tanggal yang sudah dibersihkan)
        $enrolledQuery = EnrollmentOsce::where('id_osce', $id_osce)
            ->where('tanggal_sesi', $sesi_tanggal); // <-- Pakai $sesi_tanggal, JANGAN $id_sesi

        $enrolled_ids = $enrolledQuery->pluck('id_mahasiswa');

        // 5. Query Mahasiswa
        $mahasiswa_query = Mahasiswa::whereIn('id_mahasiswa', $enrolled_ids);

        if ($search) {
            $mahasiswa_query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%");
            });
        }
        if ($angkatan) {
            $mahasiswa_query->where('kelas', $angkatan);
        }

        $mahasiswa_list = $mahasiswa_query->orderBy('nama', 'asc')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
            ]);

        // 6. Render
        return Inertia::render('Admin/RekapMahasiswaPage', [
            'osce' => $osce,
            'sesi' => [
                'id' => $id_sesi, // ID asli untuk URL
                'tanggal' => $sesi_tanggal, // Tanggal bersih
                // [FIX UTAMA] Gunakan $sesi_tanggal untuk format DateTime, bukan $id_sesi
                'tanggal_formatted' => (new \DateTime($sesi_tanggal))->format('d M Y'),
                'jam' => $sesi_jam_display 
            ],
            'mahasiswa_list' => $mahasiswa_list,
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }
    /**
     * TUGAS 2
     * GET /admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}
     * Menampilkan detail nilai mahasiswa per stase.
     *
     * Perhitungan nilai_akhir_stase:
     * (skor × bobot) untuk tiap poin → dijumlahkan → dibagi 4.
     * Skor berasal dari input penguji (0–3), bobot tetap.
     */
    public function detailNilaiMahasiswa($id_mahasiswa, $id_osce)
    {
        // Ambil enrollment mahasiswa beserta data mahasiswa & OSCE terkait
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->first();

        // Jika enrollment tidak ditemukan, hentikan eksekusi dengan 404
            if (!$enrollment) {
            abort(404, 'Data mahasiswa untuk OSCE ini tidak ditemukan.');
        }

        $tgl = $enrollment->tanggal_sesi; // Contoh: "2025-12-04"
        
        // Ambil 5 karakter pertama jam (14:56) lalu hilangkan titik dua (1456)
        $jam_raw = substr($enrollment->jam_sesi, 0, 5); 
        $jam_clean = str_replace(':', '', $jam_raw);
        
        $id_sesi_kembali = $tgl . '_' . $jam_clean;

        // Ambil semua nilai mahasiswa untuk OSCE tertentu beserta relasi stase, aspek penilaian, dan poin aspek penilaian
        $nilaiOsce = NilaiOsce::with([
                'poinAspekPenilaian.aspekPenilaian.stase',
                'enrollmentOsce.mahasiswa',
            ])
            ->where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->get();

        // Kelompokkan nilai berdasarkan Stase → Aspek → Kompetensi
        $nilaiPerStase = [];

        // Loop setiap poin nilai OSCE (tiap kompetensi)
        foreach ($nilaiOsce as $nilai) {
            $poin   = $nilai->poinAspekPenilaian; // Poin aspek penilaian
            if (!$poin) continue; // skip jika tidak ada poin

            $aspek  = $poin?->aspekPenilaian; // Aspek penilaian terkait
            $stase  = $aspek?->stase; // Stase per aspek

            // Cegah error jika tidak ada stase
            if (!$stase) continue;

            // Ambil info sesi OSCE beserta penguji
            $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
                ->where('id_stase', $stase->id_stase)
                ->with('penguji')
                ->first();

            // Gunakan nama stase sebagai key, jika null gunakan default
            $staseKey = $stase?->nama_stase ?? 'Stase Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey])) {
                $nilaiPerStase[$staseKey] = [
                    'nama_stase' => $staseKey,
                    'nama_penguji' => $osceStase?->penguji?->nama ?? '-', // Default
                    'total_skor_bobot' => 0, // Untuk menjumlah semua (skor x bobot)
                    'aspek_penilaian' => [], // Untuk tampilan
                ];
            }

            // Gunakan nama aspek sebagai key, jika null gunakan default
            $aspekKey = $aspek?->aspek ?? 'Aspek Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey])) {
                $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey] = [
                    'aspek' => $aspekKey,
                    'kompetensi' => [], // Daftar kompetensi di aspek ini
                ];
            }

            // Ambil skor dan bobot dari tabel poin_aspek_penilaian
            $skor = $poin?->skor ?? 0;     // input penguji (0–3)
            $bobot = $poin?->bobot ?? 0;   // dari rubrik
            $nilaiKali = $skor * $bobot; // hasil perkalian skor dan bobot untuk setiap kompetensinya

            // Tambahkan ke total stase
            $nilaiPerStase[$staseKey]['total_skor_bobot'] += $nilaiKali;

            // Simpan detail kompetensi untuk tampilan
            $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey]['kompetensi'][] = [
                'kompetensi' => $poin?->kompetensi ?? 'Kompetensi Tidak Dikenal',
                'skor' => $skor,
                'bobot' => $bobot,
                'hasil' => $nilaiKali,
                'nilai' => $nilaiKali,
            ];
        }

        // Hitung nilai akhir per stase
        foreach ($nilaiPerStase as $key => $stase) {
            $totalSkorBobot = $stase['total_skor_bobot'] ?? 0;
            $nilaiPerStase[$key]['nilai_akhir_stase'] = $totalSkorBobot / 4;
        }

        // Susun hasil akhir dengan array indexed agar lebih mudah diakses di frontend
        $nilai_total_osce = array_sum(array_column($nilaiPerStase, 'nilai_akhir_stase'));

        // Susun hasil akhir
        $detailNilai = [
            'mahasiswa' => [
                'nim' => $enrollment->mahasiswa->nim,
                'nama' => $enrollment->mahasiswa->nama,
                'id_mahasiswa' => $enrollment->mahasiswa->id_mahasiswa,
            ],
            'osce' => [
                'id_osce' => $enrollment->osce->id_osce,
                'nama_osce' => $enrollment->osce->nama_osce ?? '-',
            ],

            'id_sesi_kembali' => $id_sesi_kembali,
            
            'nilai_per_stase' => array_values(array_map(function ($stase) {
                $stase['aspek_penilaian'] = array_values($stase['aspek_penilaian']);
                return $stase;
            }, $nilaiPerStase)),
            'nilai_total_osce' => $nilai_total_osce, // <-- Kirim data total
        ];

        // Render halaman detail
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
        // 1. Ambil Data (Copy logic dari detailNilaiMahasiswa agar konsisten)
        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])
            ->where('id_mahasiswa', $id_mahasiswa)
            ->where('id_osce', $id_osce)
            ->firstOrFail();

        $nilaiOsce = NilaiOsce::with([
                'poinAspekPenilaian.aspekPenilaian.stase',
                'enrollmentOsce.mahasiswa',
            ])
            ->where('id_enrollment_osce', $enrollment->id_enrollment_osce)
            ->get();

        // 2. Formatting Data (Sama persis dengan sebelumnya)
        $nilaiPerStase = [];

        foreach ($nilaiOsce as $nilai) {
            $poin   = $nilai->poinAspekPenilaian;
            if (!$poin) continue;
            $aspek  = $poin?->aspekPenilaian;
            $stase  = $aspek?->stase;
            if (!$stase) continue;

            $osceStase = OsceStase::where('id_osce', $enrollment->id_osce)
                ->where('id_stase', $stase->id_stase)
                ->with('penguji')
                ->first();

            $staseKey = $stase?->nama_stase ?? 'Stase Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey])) {
                $nilaiPerStase[$staseKey] = [
                    'nama_stase' => $staseKey,
                    'nama_penguji' => $osceStase?->penguji?->nama ?? '-',
                    'total_skor_bobot' => 0,
                    'aspek_penilaian' => [],
                ];
            }

            $aspekKey = $aspek?->aspek ?? 'Aspek Tidak Dikenal';
            if (!isset($nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey])) {
                $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey] = [
                    'aspek' => $aspekKey,
                    'kompetensi' => [],
                ];
            }

            $skor = $poin?->skor ?? 0;
            $bobot = $poin?->bobot ?? 0;
            $nilaiKali = $skor * $bobot;

            $nilaiPerStase[$staseKey]['total_skor_bobot'] += $nilaiKali;

            $nilaiPerStase[$staseKey]['aspek_penilaian'][$aspekKey]['kompetensi'][] = [
                'kompetensi' => $poin?->kompetensi ?? 'Kompetensi Tidak Dikenal',
                'skor' => $skor,
                'bobot' => $bobot,
                'nilai' => $nilaiKali, // Nilai hasil kali
            ];
        }

        foreach ($nilaiPerStase as $key => $stase) {
            $totalSkorBobot = $stase['total_skor_bobot'] ?? 0;
            $nilaiPerStase[$key]['nilai_akhir_stase'] = $totalSkorBobot / 4;
        }

        // 3. Persiapkan Data untuk View PDF
        $data = [
            'mahasiswa' => [
                'nim' => $enrollment->mahasiswa->nim,
                'nama' => $enrollment->mahasiswa->nama,
            ],
            'osce' => [
                'nama_osce' => $enrollment->osce->nama_osce ?? '-',
            ],
            // Flatten array stase
            'nilai_per_stase' => array_values(array_map(function ($stase) {
                // Flatten array aspek juga agar mudah di loop di blade
                $stase['aspek_penilaian'] = array_values($stase['aspek_penilaian']);
                return $stase;
            }, $nilaiPerStase)),
            'tahun' => date('Y'),
        ];

        // 4. Generate PDF
        $pdf = Pdf::loadView('pdf.rekap_nilai', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('Hasil_OSCE_'.$enrollment->mahasiswa->nim.'.pdf');
    }
}
