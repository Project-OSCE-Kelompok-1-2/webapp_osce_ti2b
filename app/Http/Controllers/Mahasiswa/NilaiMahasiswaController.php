<?php

namespace App\Http\Controllers\Mahasiswa;

use Inertia\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use App\Services\Mahasiswa\NilaiCalculatorService;

class NilaiMahasiswaController extends Controller
{
    protected $calculator;

    public function __construct(NilaiCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    public function show($id)
    {
        // ---------------------------------------------------------------------
        // 1. EAGER LOADING DATA SECARA MENYELURUH
        //    Mengambil data mahasiswa, osce, stase, nilai, aspek penilaian
        //    agar query tidak berulang-ulang (lebih efisien dan cepat)
        // ---------------------------------------------------------------------
        $enrollment = EnrollmentOsce::with([
            'mahasiswa',
            'osce.tahunAkademik',
            'osce.osceStase.stase',
            'nilaiOsce.poinAspekPenilaian.aspekPenilaian',
        ])->findOrFail($id);

        // ---------------------------------------------------------------------
        // 2. MEMBANGUN DATA HEADER UNTUK FRONTEND
        //    (Nama mahasiswa, mata kuliah/OSCE, tahun akademik)
        //    - Mata kuliah dipersingkat: hanya tampilkan nama OSCE
        // ---------------------------------------------------------------------
        $header = [
            'mahasiswa' => [
                'nama'  => $enrollment->mahasiswa->nama ?? '-',
                'nim'   => $enrollment->mahasiswa->nim ?? '-',
                'prodi' => $enrollment->mahasiswa->prodi ?? '-',
            ],

            // Komponen ini dikoreksi: hanya nama OSCE, tanpa kode
            'mata_kuliah' => [
                'nama' => $enrollment->osce->nama_osce ?? 'OSCE',
            ],

            'tahun_akademik' => [
                'semester'  => $enrollment->osce->tahunAkademik->semester ?? '-',
                'tahun'     => $enrollment->osce->tahunAkademik->tahun ?? '-',
            ],
        ];

        // ---------------------------------------------------------------------
        // 3. PERSIAPAN DATA NILAI
        //    - Ambil semua stase OSCE
        //    - Ambil seluruh poin aspek penilaian dari mahasiswa ini
        // ---------------------------------------------------------------------
        $daftarNilai = [];
        $staseList = $enrollment->osce->osceStase;

        // Mengumpulkan seluruh poin aspek yang sudah dinilai
        // NilaiOsce mengandung poinAspekPenilaian (setiap aspek)
        dd($enrollment->nilaiOsce);
        $allPoinAspek = collect($enrollment->nilaiOsce ?? [])->flatMap(function ($nilai) {
            return collect($nilai->poinAspekPenilaian);
        });

        // ---------------------------------------------------------------------
        // 4. MEMBANGUN daftarNilai BARIS PER STASE / KOMPETENSI
        //    (Setiap stase akan menghasilkan 1 baris nilai)
        // ---------------------------------------------------------------------
        foreach ($staseList as $index => $osceStase) {

            // Ambil ID stase (identitas setiap kompetensi)
            $staseId = $osceStase->stase->id ?? null;

            if (!$staseId) {
                // Jika tidak ada ID stase, lewati saja
                continue;
            }

            // -----------------------------------------------------------------
            // FILTER: Mengambil poin aspek yang hanya milik stase ini saja
            // (Setiap stase punya aspek penilaian masing-masing)
            // -----------------------------------------------------------------
            $poinAspekPerStase = $allPoinAspek->filter(function ($poin) use ($staseId) {
                return optional($poin->aspekPenilaian)->id_stase === $staseId;
            });

            if ($poinAspekPerStase->isEmpty()) {
                // Jika stase ini belum dinilai sama sekali, skip
                continue;
            }

            // -----------------------------------------------------------------
            // 5. MEMBANGUN DATA ASPEK PENILAIAN (NESTED) UNTUK FRONTEND
            //    FE meminta key: 'kompetensi', 'bobot', 'skor'
            // -----------------------------------------------------------------
            $aspekPenilaian = $poinAspekPerStase->map(function ($poin) {
                return [
                    'aspek_id'    => $poin->aspekPenilaian->id_aspek_penilaian ?? null,
                    'kompetensi'  => $poin->aspekPenilaian->aspek ?? '-',
                    'bobot'       => $poin->aspekPenilaian->bobot_maksimum ?? 0,
                    'skor'        => $poin->skor ?? 0,
                ];
            })->toArray();

            // -----------------------------------------------------------------
            // 6. MENGHITUNG NILAI AKHIR PER STASE
            //    Bagian ini memanggil Service Najwa (logika perhitungan murni)
            //    - final_score (angka)
            //    - predicate (Sangat Baik, Baik, dll)
            // -----------------------------------------------------------------
            $calc = $this->calculator->calculateFinalGrade($poinAspekPerStase);

            // -----------------------------------------------------------------
            // 7. MEMBANGUN OUTPUT JSON BARIS UTAMA UNTUK TABEL (Level 1)
            //    Mengikuti spesifikasi FE:
            //    id, kompetensi, nilai, keterangan
            // -----------------------------------------------------------------
            $daftarNilai[] = [
                'id'         => $index + 1, // nomor urut
                'kompetensi' => $osceStase->stase->nama_stase ?? '-',
                'nilai'      => $calc['final_score'],
                'keterangan' => $calc['predicate'],
            ];
        }

        // ---------------------------------------------------------------------
        // 8. FOOTER: TOTAL NILAI + STATUS KELULUSAN
        //    Menggunakan service kalkulator yang sama (Najwa)
        // ---------------------------------------------------------------------
        $footerCalc = $this->calculator->calculateOverallResult($daftarNilai);

        $footer = [
            'total_nilai_akhir' => $footerCalc['overall_score'],
            'status_kelulusan'  => $footerCalc['status'],
        ];

        // ---------------------------------------------------------------------
        // 9. KIRIM RESPONSE INERTIA KE FRONTEND
        //    - header_detail
        //    - daftar_nilai
        //    - footer
        // ---------------------------------------------------------------------
        return inertia('Mahasiswa/NilaiShow', [
            'header_detail' => $header,
            'daftar_nilai'  => $daftarNilai,
            'footer'        => $footer,
        ]);
    }
}
