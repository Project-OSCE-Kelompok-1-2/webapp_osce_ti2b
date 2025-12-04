<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengguna;
use App\Models\Admin;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\TahunAkademik;
use App\Models\Blok;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
use App\Models\Stase;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Models\Ruang;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\Enrollment;
use App\Models\LogoInstitusi;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =====================================================================
        // 1. KONFIGURASI WAKTU & SESI
        // =====================================================================
        $waktuEksekusi = Carbon::now('Asia/Jakarta');

        $durasiPerMhs = 7; // menit
        $jumlahMhsPerSesi = 7; // orang
        $durasiSesi = $durasiPerMhs * $jumlahMhsPerSesi; // 49 menit

        // --- SKENARIO A: UJIAN SEDANG BERLANGSUNG (ACTIVE) ---
        // SESI 1: Sedang Berlangsung (Mulai 1 menit yang lalu)
        $sesi1Mulai = $waktuEksekusi->copy()->subMinutes(1);
        $sesi1Selesai = $sesi1Mulai->copy()->addMinutes($durasiSesi);

        // SESI 2: 2 Jam setelah Sesi 1 Selesai (Mendatang)
        $sesi2Mulai = $sesi1Selesai->copy()->addHours(2);
        $sesi2Selesai = $sesi2Mulai->copy()->addMinutes($durasiSesi);

        // SESI 3: 2 Jam setelah Sesi 2 Selesai (Mendatang)
        $sesi3Mulai = $sesi2Selesai->copy()->addHours(2);
        $sesi3Selesai = $sesi3Mulai->copy()->addMinutes($durasiSesi);

        // Event Global Active: Mencakup semua sesi (Buffer 1 jam sebelum dan sesudah)
        $eventActiveMulai = $sesi1Mulai->copy()->subHour();
        $eventActiveSelesai = $sesi3Selesai->copy()->addHour();

        // --- SKENARIO B: UJIAN SUDAH SELESAI (HISTORY/PAST) ---
        // Dilaksanakan 1 bulan yang lalu
        $pastEventMulai = $waktuEksekusi->copy()->subMonth();
        $pastEventSelesai = $pastEventMulai->copy()->addHours(5); // Durasi 5 jam

        // Sesi di masa lalu
        $pastSesiMulai = $pastEventMulai->copy()->addMinutes(30);
        $pastSesiSelesai = $pastSesiMulai->copy()->addMinutes($durasiSesi);

        $this->command->info("--------------------------------------------------");
        $this->command->info("WAKTU SEKARANG : " . $waktuEksekusi->format('H:i:s'));
        $this->command->info("--- SKENARIO ACTIVE ---");
        $this->command->info("SESI 1 (Active): " . $sesi1Mulai->format('H:i') . " - " . $sesi1Selesai->format('H:i'));
        $this->command->info("SESI 2 (Next)  : " . $sesi2Mulai->format('H:i') . " - " . $sesi2Selesai->format('H:i'));
        $this->command->info("SESI 3 (Last)  : " . $sesi3Mulai->format('H:i') . " - " . $sesi3Selesai->format('H:i'));
        $this->command->info("--- SKENARIO SELESAI ---");
        $this->command->info("EVENT HISTORY  : " . $pastEventMulai->format('d M Y'));
        $this->command->info("--------------------------------------------------");

        // =====================================================================
        // 2. DATA USER & MAHASISWA
        // =====================================================================

        LogoInstitusi::factory()->create([
            'nama_institusi' => 'Politeknik Negeri Semarang',
            'path_logo' => 'images/logo_polines.png',
            'deskripsi' => 'Program Studi Ilmu Keperawatan Fakultas Kedokteran, Kesehatan Masyarakat, dan Keperawatan',
        ]);

        $userAdmin = Pengguna::factory()->create(['username' => 'admin', 'jenis_role' => 'admin', 'password' => ('password')]);
        Admin::factory()->create(['id_pengguna' => $userAdmin->id_pengguna]);

        $ta = TahunAkademik::factory()->create([
            'tahun' => '2025/2026',
            'semester' => 'Ganjil',
            'status' => 'aktif'
        ]);

        // Instruktur
        $daftarInstruktur = [
            ['nama' => 'Sutono, S.Kp., M.Sc., M.Kep', 'username' => 'sutono'],
            ['nama' => 'Maryami Yuliana Kosim, S.Kep., Ns., M.Kep., Ph.D', 'username' => 'maryami'],
            ['nama' => 'Dr. Sri Setiyarini, S.Kp., M.Kes', 'username' => 'setiyarini'],
            ['nama' => 'Syahirul Alim, S.Kp., MNSc., Ph.D', 'username' => 'syahirul'],
            ['nama' => 'Khudazi Aulawi, S.Kp., M.Kes., MNSc., Ph.D', 'username' => 'khudazi'],
            ['nama' => 'Anggi Lukman Wicaksana, S.Kep., Ns, MS., PhD', 'username' => 'anggi'],
            ['nama' => 'Arifin Triyanto, S.Kep., Ns., M.Kep., Sp.KMB', 'username' => 'arifin'],
        ];

        $pengujis = collect();
        foreach ($daftarInstruktur as $data) {
            $user = Pengguna::factory()->create(['username' => $data['username'], 'jenis_role' => 'penguji', 'password' => ('password')]);
            $pengujis->push(Penguji::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama']]));
        }

        // Mahasiswa - KELOMPOK 1 (Sesi 1 - Active)
        $klp1 = [
            ['niu' => '511953', 'nama' => 'Dini Afiana'],
            ['niu' => '512440', 'nama' => 'Arrifa Ilyana Cholarin'],
            ['niu' => '513078', 'nama' => 'Merlina Dwi Wahyuni'],
            ['niu' => '513248', 'nama' => 'Rahmatika Nuha Syafura'],
            ['niu' => '514514', 'nama' => 'Petra Angelina G.P.'],
            ['niu' => '514752', 'nama' => 'Melvia Dinda C.D.'],
            ['niu' => '514914', 'nama' => 'Christine Chintia T.'],
        ];

        // Mahasiswa - KELOMPOK 2 (Sesi 2 - Next)
        $klp2 = [
            ['niu' => '512932', 'nama' => 'Shelly Yolanda Putri'],
            ['niu' => '514825', 'nama' => 'Alya Ramdhani'],
            ['niu' => '515848', 'nama' => 'Nuriyatul Aini Sa\'diyah'],
            ['niu' => '517347', 'nama' => 'Nadia Rizky Aliffia C.'],
            ['niu' => '517577', 'nama' => 'Ratri Azzahra Utami'],
            ['niu' => '518857', 'nama' => 'Ismi Maulfi Rahma'],
            ['niu' => '518877', 'nama' => 'Herawati Kahartan'],
        ];

        // Mahasiswa - KELOMPOK 3 (Sesi 3 - Last)
        $klp3 = [
            ['niu' => '514180', 'nama' => 'Alifa Cahya Nugraha'],
            ['niu' => '514400', 'nama' => 'Syafira Nur Rosyida'],
            ['niu' => '516548', 'nama' => 'Annisa Zulkha Avivah'],
            ['niu' => '517626', 'nama' => 'Latifa Hanum Sabrina'],
            ['niu' => '517820', 'nama' => 'Lolita Ayu Maharani'],
            ['niu' => '518906', 'nama' => 'Velysia Irgi Novitasari'],
            ['niu' => '519068', 'nama' => 'Aristya Salsabila'],
        ];

        // Mahasiswa - KELOMPOK 4 (History - Sudah Ada Nilai)
        $klp4 = [
            ['niu' => '519132', 'nama' => 'Riekha Yustiana'],
            ['niu' => '521830', 'nama' => 'Annisa Nurlaila J.'],
            ['niu' => '522024', 'nama' => 'Aulia Dewi Suryani'],
            ['niu' => '522842', 'nama' => 'Cinta Kayla A.'],
            ['niu' => '522865', 'nama' => 'Herla Afrisa C.'],
            ['niu' => '522974', 'nama' => 'Annisa Nur Eka M.'],
            ['niu' => '523077', 'nama' => 'Nafarum Chealsi E.'],
        ];

        // Gabung semua mhs untuk create user di database
        $allMhsData = array_merge($klp1, $klp2, $klp3, $klp4);

        foreach ($allMhsData as $data) {
            $user = Pengguna::factory()->create(['username' => 'mhs.' . $data['niu'], 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
            $mhs = Mahasiswa::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama'], 'nim' => $data['niu'], 'prodi' => 'Ilmu Keperawatan']);
            Enrollment::factory()->create(['id_mahasiswa' => $mhs->id_mahasiswa, 'id_tahun_akademik' => $ta->id_tahun_akademik]);
        }

        // =====================================================================
        // 3. KURIKULUM & STASE
        // =====================================================================
        $blok = Blok::factory()->create([
            'nama_blok' => 'Basic Nursing Skills 6 (BNS 6) Semester 5',
            'deskripsi' => 'Blok pembelajaran keterampilan klinis keperawatan semester 5 yang mencakup resusitasi, perawatan trauma, perioperatif, dan perawatan kritis.'
        ]);
        $randomEnrollment = Enrollment::first();

        // 4 Mata Kuliah - FIX: Tambahkan id_enrollment agar tidak error
        $mk1 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $randomEnrollment->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Gawat Darurat & Kardiovaskuler'
        ]);
        $mk2 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $randomEnrollment->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Muskuloskeletal & Trauma'
        ]);
        $mk3 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $randomEnrollment->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Bedah Dasar'
        ]);
        $mk4 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $randomEnrollment->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Respirasi'
        ]);

        // Definisi 7 Stase LENGKAP
        $daftarStase = [
            // MK 1: Gawat Darurat & Kardio
            [
                'mk_id' => $mk1->id_mata_kuliah,
                'nama' => 'Resusitasi Jantung Paru (RJP)',
                'ruang' => 'Ruang IGD',
                'skenario' => 'Saudara bertugas sebagai tim PSC 119 di wilayah Kota, sedang berpatroli di jalan dan menemukan Seorang laki laki, tergeletak di pinggir jalan, kira-kira usianya diatas 50an tahun. Tampaknya orang tersebut sedang dalam kegiatan jogging. Saat disapa tidak ada respon sama sekali, badan dan ekstremitas teraba dingin.',
                'tujuan' => [
                    'Mahasiswa mampu mendemonstrasikan tindakan RJP dengan menggunakan alat peraga berupa manikin dan mampu menggunakan AED.',
                    'Mahasiswa mampu melakukan kompresi dada berkualitas tinggi (High Quality CPR) sesuai standar.',
                    'Mahasiswa mampu memberikan ventilasi yang efektif menggunakan Bag Valve Mask (BVM).',
                    'Mahasiswa mampu melakukan evaluasi pasca resusitasi.'
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Tahap Pre Interaksi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Pastikan keamanan: Aman penolong', 'bobot' => 2],
                            ['kompetensi' => 'Pastikan keamanan: Aman korban', 'bobot' => 2],
                            ['kompetensi' => 'Pastikan keamanan: Aman lingkungan', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'B. Tahap Orientasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Kaji respon (panggil, goncangan lembut)', 'bobot' => 2],
                            ['kompetensi' => 'Segera aktifkan EMS/PSC 119 (call for help)', 'bobot' => 2],
                            ['kompetensi' => 'Termasuk sebutkan perlunya defibrillator/AED', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 80,
                        'poin' => [
                            ['kompetensi' => 'Check nadi karotis (sambil melihat pengembangan dada/pernapasan), ≤10 detik', 'bobot' => 6],
                            ['kompetensi' => 'Bila nadi karotis tidak teraba, segera lakukan kompresi dada (center of chest)', 'bobot' => 2],
                            ['kompetensi' => 'Tempatkan 1 tangan pada titik tersebut, tangan lain di atasnya, jari saling bertautan', 'bobot' => 2],
                            ['kompetensi' => 'Lakukan kompresi 30 kali', 'bobot' => 7],
                            ['kompetensi' => 'Kecepatan 100-120 x/menit', 'bobot' => 7],
                            ['kompetensi' => 'Kedalaman 5-6 cm', 'bobot' => 7],
                            ['kompetensi' => 'Fully recoil', 'bobot' => 7],
                            ['kompetensi' => 'Minimalisasi interupsi', 'bobot' => 7],
                            ['kompetensi' => 'Buka jalan napas (head tilt-chin lift / jaw thrust)', 'bobot' => 5],
                            ['kompetensi' => 'Memastikan kepatenan jalan napas (bersihkan benda asing dengan cross fingers & finger sweep)', 'bobot' => 5],
                            ['kompetensi' => 'Berikan 2 kali bantuan napas (1 detik/napas dengan BVM) dan kaji pengembangan dada', 'bobot' => 4],
                            ['kompetensi' => 'Lanjutkan CPR (30 kompresi: 2 ventilasi) atau sampai tersedia AED', 'bobot' => 4],
                            ['kompetensi' => 'Bila AED tersedia, lakukan defibrilasi sesuai panduan alat, lalu lanjutkan CPR; bila tidak ada, lanjutkan CPR', 'bobot' => 5],
                            ['kompetensi' => 'Setiap 2 menit CPR, selalu periksa nadi karotis', 'bobot' => 2],
                            ['kompetensi' => 'Bila nadi belum ada, lanjutkan CPR; bila nadi teraba tapi tidak ada napas, lakukan RB dan cek setiap 2 menit', 'bobot' => 5],
                            ['kompetensi' => 'Bila nadi dan napas ada, lakukan head to toe examination (cek luka, perdarahan, patah tulang)', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'D. Tahap Terminasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Berikan posisi recovery bila tidak ada kontraindikasi', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'E. Handover',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Handover pasien ke petugas IGD', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 2: Muskulo & Trauma
            [
                'mk_id' => $mk2->id_mata_kuliah,
                'nama' => 'Perawatan Traksi (Tulang)',
                'ruang' => 'Ruang Rawat Inap A',
                'skenario' => 'Tn. B (42 tahun) mengalami kecelakaan lalu lintas yang mengakibatkan fraktur pada tibia dextra. Di ruang gawat darurat, dokter memasang traksi tulang dengan beban traksi 8kg. saat ini Tn.B dirawat di bangsal ortopedi untuk pemulihan kondisi dan perawatan traksi. Tiap hari Ns. Arika melakukan perawatan traksi dengan mengecek kondisi neurovascular bagian distal kaki kanan yang terpasang traksi.',
                'tujuan' => [
                    'Mahasiswa mampu menjelaskan prinsip kerja traksi tulang dan kulit.',
                    'Mahasiswa mampu melakukan pengkajian neurovaskuler distal (5P: Pain, Pallor, Pulselessness, Paresthesia, Paralysis).',
                    'Mahasiswa mampu melakukan perawatan luka tusukan pin (pin site care) dengan teknik aseptik.',
                    'Mahasiswa mampu memastikan posisi dan beban traksi berfungsi dengan benar.'
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Tahap Pre Interaksi',
                        'bobot' => 6,
                        'poin' => [
                            ['kompetensi' => 'Cek catatan keperawatan dan catatan medis pasien', 'bobot' => 2],
                            ['kompetensi' => 'Siapkan alat-alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci tangan sebelum merawat pasien', 'bobot' => 2],
                        ]
                    ],
                    [
                        'nama' => 'B. Tahap Orientasi',
                        'bobot' => 13,
                        'poin' => [
                            ['kompetensi' => 'Berikan salam dan menanyakan identitas klien', 'bobot' => 4],
                            ['kompetensi' => 'Menjelaskan maksud dan tujuan tindakan', 'bobot' => 4],
                            ['kompetensi' => 'Berikan kesempatan bertanya dan jaga privasi pasien', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 66,
                        'poin' => [
                            ['kompetensi' => 'Gunakan sarung tangan bersih', 'bobot' => 2],
                            ['kompetensi' => 'Atur posisi klien dalam posisi lurus (alignment) di tempat tidur untuk mempertahankan tarikan traksi yang optimal', 'bobot' => 5],
                            ['kompetensi' => 'Turunkan beban traksi', 'bobot' => 2],
                            ['kompetensi' => 'Pasang perlak dan dekatkan bengkok di sekitar area tubuh yang terpasang traksi', 'bobot' => 2],
                            ['kompetensi' => 'Buka balutan sekitar pin tanpa mempengaruhi sistem traksi', 'bobot' => 2],
                            ['kompetensi' => 'Kaji area sekitar pin, kulit dan adanya tanda Komplikasi (5P1T)', 'bobot' => 5],
                            ['kompetensi' => 'Buka set ganti balut, cairan pembersih dan gunakan sarung tangan steril', 'bobot' => 5],
                            ['kompetensi' => 'Bersihkan pin serta area kulit sekitar pin, menggunakan teknik aseptik dengan prinsip menjauh dari pin (dari dalam ke luar)', 'bobot' => 10],
                            ['kompetensi' => 'Beri salep anti bakteri / dressing jika diperlukan sesuai protokol RS', 'bobot' => 5],
                            ['kompetensi' => 'Tutup kassa di lokasi penusukan pin', 'bobot' => 5],
                            ['kompetensi' => 'Kaji area sekitar balutan traksi untuk mengidentifikasi status neurovaskuler pasien (5P1T)', 'bobot' => 5],
                            ['kompetensi' => 'Atur posisi pasien sesuai dengan arah tarikan traksi sesuai dengan aligment tulang', 'bobot' => 4],
                            ['kompetensi' => 'Rapikan kembali pasien dan lingkungan tempat tidur pasien', 'bobot' => 5],
                            ['kompetensi' => 'Buang alat-alat yang telah dipakai ke dalam plastik khusus infeksius', 'bobot' => 2],
                            ['kompetensi' => 'Lepas sarung tangan', 'bobot' => 2],
                            ['kompetensi' => 'Lakukan pengecekan sistem traksi, pastikan traksi tidak bergeser atau berubah, cek tali dan beban', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'D. Tahap Terminasi',
                        'bobot' => 10,
                        'poin' => [
                            ['kompetensi' => 'Akhiri dan simpulkan kegiatan', 'bobot' => 3],
                            ['kompetensi' => 'Evaluasi perasaan pasien', 'bobot' => 2],
                            ['kompetensi' => 'Kontrak kegiatan yang akan datang', 'bobot' => 3],
                            ['kompetensi' => 'Bereskan alat dan cuci tangan', 'bobot' => 2],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Catat Tindakan yang telah dilakukan dan respon pasien', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 1: Gawat Darurat & Kardio (Lanjutan)
            [
                'mk_id' => $mk1->id_mata_kuliah,
                'nama' => 'Perekaman EKG 12 Lead',
                'ruang' => 'Ruang Komunitas',
                'skenario' => 'Ny. Ana, 40 th, datang ke poli jatung dengan keluhan dada terasa berdebar-debar, mudah lelah saat beraktifitas. Setelah dilakukan anamnesa singkat dokter meminta perawat untuk melakukan perekaman EKG 12 lead.',
                'tujuan' => [
                    'Mahasiswa mampu mempersiapkan pasien dan alat untuk perekaman EKG.',
                    'Mahasiswa mampu menentukan lokasi pemasangan elektroda ekstremitas dan prekordial (V1-V6) dengan tepat.',
                    'Mahasiswa mampu mengoperasikan mesin EKG untuk mendapatkan hasil rekaman yang bebas artefak.',
                    'Mahasiswa mampu mengidentifikasi kelainan irama jantung dasar dari hasil rekaman.',
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Pra-Interaksi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Verifikasi order', 'bobot' => 1],
                            ['kompetensi' => 'Menyiapkan alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci tangan', 'bobot' => 2],
                        ]
                    ],
                    [
                        'nama' => 'B. Orientasi',
                        'bobot' => 15,
                        'poin' => [
                            ['kompetensi' => 'Menanyakan nama dan mengecek gelang identitas pasien', 'bobot' => 5],
                            ['kompetensi' => 'Menjelaskan tindakan', 'bobot' => 5],
                            ['kompetensi' => 'Jaga privacy', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 65,
                        'poin' => [
                            ['kompetensi' => 'Minta/bantu klien melepas pakaian bagian atas', 'bobot' => 1],
                            ['kompetensi' => 'Posisikan klien', 'bobot' => 5],
                            ['kompetensi' => 'Bersihkan tempat penyadapan dan berikan jelly jika diperlukan', 'bobot' => 2],
                            ['kompetensi' => 'Pasang electrode ekstremitas', 'bobot' => 10],
                            ['kompetensi' => 'Pasang electrode prekordial', 'bobot' => 20],
                            ['kompetensi' => 'Instruksikan klien untuk diam dan tenang', 'bobot' => 5],
                            ['kompetensi' => 'Rekam EKG secara manual', 'bobot' => 20],
                            ['kompetensi' => 'Lepas ektrode dan bersihkan bekas jelly', 'bobot' => 2],
                        ]
                    ],
                    [
                        'nama' => 'D. Terminasi',
                        'bobot' => 10,
                        'poin' => [
                            ['kompetensi' => 'Evaluasi perasaan dan hasil', 'bobot' => 4],
                            ['kompetensi' => 'Kesimpulan kegiatan', 'bobot' => 3],
                            ['kompetensi' => 'Kontrak aktifitas selanjutnya', 'bobot' => 3],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Lakukan pendokumentasian', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 3: Bedah Dasar
            [
                'mk_id' => $mk3->id_mata_kuliah,
                'nama' => 'Hecting (Menjahit Luka Sederhana)',
                'ruang' => 'Ruang Bedah',
                'skenario' => 'Seorang laki-laki (35 tahun) masuk di Instalasi Gawat Darurat (IGD) RS Z karena kecelakaan lalu lintas. Setelah perawat melakukan pemeriksaan head to toe, didapatkan luka laserasi dengan kedalaman 0,5 cm, dan diameter luka 5 cm di tibia kiri. Kondisi luka agak kotor, terdapat serpihan pasir dan rembesan darah. Perawat jaga segera melakukan penjahitan luka sederhana dan perawatan luka untuk mencegah infeksi.',
                'tujuan' => [
                    'Mahasiswa mampu melakukan persiapan alat bedah minor dan persiapan pasien secara steril.',
                    'Mahasiswa mampu melakukan tindakan anestesi lokal (infiltrasi) dengan teknik yang benar.',
                    'Mahasiswa mampu melakukan pencucian dan desinfeksi luka dengan prinsip aseptik.',
                    'Mahasiswa mampu mendemonstrasikan teknik penjahitan luka sederhana (Simple Interrupted Suture).',
                    'Mahasiswa mampu melakukan penutupan luka (dressing) pasca penjahitan.',
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Tahap Pre Interaksi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Verifikasi order/tindakan', 'bobot' => 2],
                            ['kompetensi' => 'Menyiapkan alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci Tangan', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'B. Tahap Orientasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Salam dan menyebutkan nama', 'bobot' => 1],
                            ['kompetensi' => 'Menjelaskan tindakan (kontrak)', 'bobot' => 2],
                            ['kompetensi' => 'Menjaga privacy pasien', 'bobot' => 2],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 80,
                        'poin' => [
                            ['kompetensi' => 'Melakukan disinfeksi / sterilisasi bagian tubuh yang akan dilakukan penjahitan dengan larutan antiseptik', 'bobot' => 5],
                            ['kompetensi' => 'Memasang duk lubang pada bagian tubuh yang akan dijahit, sesuaikan luas lubang duk dengan luas luka.', 'bobot' => 5],
                            ['kompetensi' => 'Jepit jarum dengan needle holder kira-kira sepertiga bagian pangkal jarum', 'bobot' => 10],
                            ['kompetensi' => 'Ambil pinset anatomis untuk mengecek efek obat anestesi. Angkat bagian tepi luka menggunakan pinset', 'bobot' => 10],
                            ['kompetensi' => 'Penusukan dilakukan 0,5 cm dari tepi luka di dekat tempat yang dijepit dengan mengangkat dan meregangkan kulit.', 'bobot' => 10],
                            ['kompetensi' => 'Mendorong jarum maju dengan gerakan supinasi pergelangan tangan dan adduksi bahu serentak', 'bobot' => 5],
                            ['kompetensi' => 'Setelah jarum muncul dari balik kulit, ujung jarum ditarik dengan needle holder, dengan menarik benang sampaiujungnya tersisa 3-4 cm dari kulit.', 'bobot' => 5],
                            ['kompetensi' => 'Tangan kiri memegang benang yang panjang, tangan kanan memegang needle holder.', 'bobot' => 5],
                            ['kompetensi' => 'Membuat lilitan benang panjang dengan needle holder sedemikian rupa sehingga membentuk simpul benang.', 'bobot' => 5],
                            ['kompetensi' => 'Memotong benang dengan gunting steril sisakan benang kira-kira 0,5 cm dari luka, simpul berada ditepi luka', 'bobot' => 5],
                            ['kompetensi' => 'Lakukan tindakan di atas sampai bagian luka tertutup sepenuhnya.', 'bobot' => 5],
                            ['kompetensi' => 'Evaluasi hasil jahitan. Jahitan tidak boleh terlalu kencang atau kendor, tepi luka harus saling bertemu', 'bobot' => 10],
                        ]
                    ],
                    [
                        'nama' => 'D. Tahap Terminasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Evaluasi perasaan, kesimpulan, kontrak, bereskan alat', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Lakukan pendokumentasian tindakan (kondisi dan jenis luka, metode hecting, jenis benang dan jarum yang di gunakan)', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 2: Muskulo & Trauma (Lanjutan)
            [
                'mk_id' => $mk2->id_mata_kuliah,
                'nama' => 'Balut Bidai (Pembidaian)',
                'ruang' => 'Ruang Bedah Minor',
                'skenario' => 'Ny. Eka, usia 47 tahun, mengalami kecelakaan lalu lintas dengan keluhan nyeri hebat di bagian cruris (tibia fibula) dextra. Saat dikaji, pasien mengatakan tidak mampu menggerakkan kaki kanan dan setelah dibandingan dengan kaki kiri terlihat perbedaan panjang kedua kaki. Dicurigai ada fraktur os. tibia dan os. fibula dekstra. Ns. Adi yang saat itu berada di lokasi kejadian mempersiapkan untuk melakukan tindakan pembidaian pada Ny. Eka.',
                'tujuan' => [
                    'Mahasiswa mampu mengidentifikasi indikasi pembidaian pada kasus trauma.',
                    'Mahasiswa mampu melakukan pemeriksaan neurovaskuler (PMS) sebelum dan sesudah tindakan.',
                    'Mahasiswa mampu memilih dan memasang bidai yang melewati dua sendi.',
                    'Mahasiswa mampu melakukan teknik fiksasi bidai yang kuat namun tidak mengganggu sirkulasi.',
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Pra-Interaksi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Verifikasi order', 'bobot' => 2],
                            ['kompetensi' => 'Menyiapkan alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci tangan', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'B. Orientasi',
                        'bobot' => 15,
                        'poin' => [
                            ['kompetensi' => 'Salam dan menyebutkan nama', 'bobot' => 5],
                            ['kompetensi' => 'Menjelaskan tindakan', 'bobot' => 5],
                            ['kompetensi' => 'Jaga privacy', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 65,
                        'poin' => [
                            ['kompetensi' => 'Memeriksa bagian tubuh yang akan dibidai/cedera. Inspeksi palpasi, gerakan.', 'bobot' => 15],
                            ['kompetensi' => 'Memilih dan mempersiapkan bidai dan pengikat', 'bobot' => 20],
                            ['kompetensi' => 'Melakukan pembidaian dengan cara yang benar: Meminimalkan pergerakan; Melewati dua sendi; Mengikat bidai dengan kencang (4 pengikat), tidak kendor.', 'bobot' => 30],
                        ]
                    ],
                    [
                        'nama' => 'D. Terminasi',
                        'bobot' => 10,
                        'poin' => [
                            ['kompetensi' => 'Evaluasi hasil pembidaian secara subjective (nyeri)', 'bobot' => 4],
                            ['kompetensi' => 'Kesimpulan kegiatan', 'bobot' => 3],
                            ['kompetensi' => 'Kontrak aktivitas selanjutnya', 'bobot' => 3],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Lakukan pendokumentasian tindakan', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 4: Respirasi
            [
                'mk_id' => $mk4->id_mata_kuliah,
                'nama' => 'Terapi Oksigen & Nebulisasi',
                'ruang' => 'Ruang ICU',
                'skenario' => 'Tn. Budi, 35 tahun, dirawat karena asma akut. la datang dengan sesak napas dan napas cepat. Saturasi oksigen 85%. Pasien diberi oksigen 12 L/menit dengan Non-Rebreathing Mask, saturasi meningkat menjadi 96%. Terapi dilanjutkan dengan nebulisasi ventolin 5 mg',
                'tujuan' => [
                    'Mahasiswa mampu mengkaji status oksigenasi pasien dan indikasi terapi oksigen.',
                    'Mahasiswa mampu memilih alat terapi oksigen yang tepat (Nasal Kanul, Masker, NRM) sesuai kondisi.',
                    'Mahasiswa mampu mempersiapkan dan memberikan terapi oksigen dengan flow rate yang sesuai.',
                    'Mahasiswa mampu melakukan prosedur nebulisasi dengan benar.',
                    'Mahasiswa mampu mengevaluasi respon pasien terhadap terapi (SpO2, suara napas).',
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Persiapan',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Verifikasi order dan/atau cek indikasi pasien', 'bobot' => 2],
                            ['kompetensi' => 'Menyiapkan Alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci tangan 6 langkah dengan tepat', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'B. Orientasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Memberi salam, menyebutkan nama & identifikasi identitas pasien', 'bobot' => 2],
                            ['kompetensi' => 'Menjelaskan tujuan, prosedur dan kontrak waktu', 'bobot' => 2],
                            ['kompetensi' => 'Menjaga privasi', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'C. Pelaksanaan',
                        'bobot' => 80,
                        'poin' => [
                            ['kompetensi' => 'Kaji keluhan pasien dan ukur ulang SpO2', 'bobot' => 5],
                            ['kompetensi' => 'Isi glass humidifier dengan water for irigation setinggi batas air', 'bobot' => 5],
                            ['kompetensi' => 'Buka pengatur aliran O2 (kran) antara tabung dan pressure regulator dan cek fungsi flow meter', 'bobot' => 10],
                            ['kompetensi' => 'Pilih alat yang tepat sesuai kebutuhan pasien', 'bobot' => 20],
                            ['kompetensi' => 'Hubungkan selang dan alirkan oksigen (NRM 10-15 l/m)', 'bobot' => 15],
                            ['kompetensi' => 'Cek aliran oksigen atau isi reservoir dengan oksigen', 'bobot' => 15],
                            ['kompetensi' => 'Pasangkan dan fiksasi peralatan oksigen ke pasien sesuai posisi pasien', 'bobot' => 10],
                        ]
                    ],
                    [
                        'nama' => 'D. Terminasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Kesimpulan, Evaluasi Perasaan, Kontrak, Cuci tangan', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Dokumentasi', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
            // MK 4: Respirasi (Lanjutan)
            [
                'mk_id' => $mk4->id_mata_kuliah,
                'nama' => 'Perawatan Trakeostomi & Suctioning',
                'ruang' => 'Ruang Rawat Inap B',
                'skenario' => 'Ny. D (40 tahun) dengan diagnose medis Stroke hemoragik, baru saja menjalani tindakan trakeostomi. Keadaan pasien stabil dengan kesadaran GCS 2:3:2. Saat ini terpasang trakeostomi tube dengan balon masih dikembangkan, sekitar luka kering, tidak ada rembesan darah. Program post trakeostomi meliputi: rawat trakeostomi secara aseptic, balon dikembangkan sampai dengan produksi sekret stabil, suctioning dilakukan jika pasien tidak adekuat mengeluarkan sekret.',
                'tujuan' => [
                    'Mahasiswa mampu mengkaji kebutuhan suctioning pada pasien dengan trakeostomi.',
                    'Mahasiswa mampu melakukan prosedur suctioning melalui trakeostomi dengan prinsip steril.',
                    'Mahasiswa mampu melakukan perawatan stoma trakeostomi (pembersihan luka, ganti balutan).',
                    'Mahasiswa mampu melakukan penggantian tali pengikat trakeostomi dengan aman.',
                ],
                'aspek' => [
                    [
                        'nama' => 'A. Tahap Pra Interaksi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Verifikasi order/tindakan', 'bobot' => 2],
                            ['kompetensi' => 'Menyiapkan alat', 'bobot' => 2],
                            ['kompetensi' => 'Cuci tangan', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'B. Tahap Orientasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Berikan salam dengan menyebut nama pasien', 'bobot' => 2],
                            ['kompetensi' => 'Menjelaskan tujuan dan prosedur tindakan', 'bobot' => 2],
                            ['kompetensi' => 'Menjaga privasi', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'C. Tahap Kerja',
                        'bobot' => 80,
                        'poin' => [
                            ['kompetensi' => 'Letakkan perlak dan pengalas di bawah area tindakan. Letakkan bengkok dekat area tindakan.', 'bobot' => 5],
                            ['kompetensi' => 'Pakai sarung tangan bersih', 'bobot' => 5],
                            ['kompetensi' => 'Ambil kassa humidifier', 'bobot' => 5],
                            ['kompetensi' => 'Lepaskan pita & instruksikan asisten pegang trakeostomi', 'bobot' => 5],
                            ['kompetensi' => 'Pakai sarung tangan steril', 'bobot' => 10],
                            ['kompetensi' => 'Bersihkan stoma dengan teknik aseptik. Berikan salep antibiotik (bila perlu)', 'bobot' => 20],
                            ['kompetensi' => 'Beri kassa steril kering di bawah dan samping stoma', 'bobot' => 10],
                            ['kompetensi' => 'Pasang tali pengikat trakeostomi dan cek cuff trakeostomi. Tambahkan tekanan udara (bila perlu)', 'bobot' => 10],
                            ['kompetensi' => 'Beri kassa humidifier', 'bobot' => 5],
                            ['kompetensi' => 'Cek status pernapasan dan area sekitar trakeostomi', 'bobot' => 5],
                        ]
                    ],
                    [
                        'nama' => 'D. Tahap Terminasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Akhiri dan simpulkan kegiatan', 'bobot' => 2],
                            ['kompetensi' => 'Evaluasi perasaan pasien', 'bobot' => 2],
                            ['kompetensi' => 'Kontrak kegiatan selanjutnya, Bereskan alat dan cuci tangan', 'bobot' => 1],
                        ]
                    ],
                    [
                        'nama' => 'E. Dokumentasi',
                        'bobot' => 5,
                        'poin' => [
                            ['kompetensi' => 'Catat tindakan & respon pasien', 'bobot' => 5],
                        ]
                    ]
                ]
            ],
        ];

        // =====================================================================
        // 4. EKSEKUSI PENGISIAN DATABASE
        // =====================================================================

        // A. OSCE ACTIVE (SEDANG BERLANGSUNG)
        $osceActive = Osce::factory()->create([
            'id_tahun_akademik' => $ta->id_tahun_akademik,
            'nama_osce' => 'OSCE BNS 6 Semester Gasal 2025/2026 (Active)',
            'tanggal_mulai' => $eventActiveMulai->format('Y-m-d H:i:s'),
            'tanggal_selesai' => $eventActiveSelesai->format('Y-m-d H:i:s'),
        ]);

        // B. OSCE PAST (SUDAH SELESAI - UNTUK TES NILAI)
        $oscePast = Osce::factory()->create([
            'id_tahun_akademik' => $ta->id_tahun_akademik,
            'nama_osce' => 'OSCE Pra-Klinik BNS 5 (History)',
            'tanggal_mulai' => $pastEventMulai->format('Y-m-d H:i:s'),
            'tanggal_selesai' => $pastEventSelesai->format('Y-m-d H:i:s'),
        ]);

        $staseObjects = collect();
        $ruangs = collect();

        // Create Stase, Aspek, Poin, Ruang
        foreach ($daftarStase as $index => $dataStase) {
            // 1. Buat RUANG dulu
            $ruang = Ruang::factory()->create([
                'nomor_ruangan' => 'R-' . ($index + 1),
                'lokasi' => $dataStase['ruang']
            ]);
            $ruangs->push($ruang);

            // 2. Buat STASE (Parent)
            // Ini WAJIB dibuat sebelum Tujuan Pembelajaran agar kita punya id_stase
            $stase = Stase::factory()->create([
                'id_mata_kuliah' => $dataStase['mk_id'],
                'nama_stase' => $dataStase['nama'],
                'deskripsi' => implode("\n", $dataStase['tujuan'])
            ]);
            $staseObjects->push($stase);

            // 3. Buat TUJUAN PEMBELAJARAN (Child)
            // Loop setiap poin tujuan yang ada di array, dan masukkan id_stase yang baru dibuat
            foreach ($dataStase['tujuan'] as $poinTujuan) {
                TujuanPembelajaran::factory()->create([
                    'id_stase' => $stase->id_stase,
                    'tujuan' => $poinTujuan
                ]);
            }

            // 4. Buat ASPEK & POIN PENILAIAN
            foreach ($dataStase['aspek'] as $dataAspek) {
                $aspek = AspekPenilaian::factory()->create([
                    'id_stase' => $stase->id_stase,
                    'aspek' => $dataAspek['nama'],
                    'bobot_maksimum' => $dataAspek['bobot']
                ]);

                foreach ($dataAspek['poin'] as $dataPoin) {
                    PoinAspekPenilaian::factory()->create([
                        'id_aspek_penilaian' => $aspek->id_aspek_penilaian,
                        'kompetensi' => $dataPoin['kompetensi'],
                        'bobot' => $dataPoin['bobot']
                    ]);
                }
            }
        }

        // =====================================================================
        // 5. MAPPING JADWAL & PESERTA PER SESI (ACTIVE EVENT)
        // =====================================================================
        $sesiConfigsActive = [
            ['mahasiswas' => $klp1, 'mulai' => $sesi1Mulai, 'selesai' => $sesi1Selesai], // Sesi 1 (Active)
            ['mahasiswas' => $klp2, 'mulai' => $sesi2Mulai, 'selesai' => $sesi2Selesai], // Sesi 2 (Next)
            ['mahasiswas' => $klp3, 'mulai' => $sesi3Mulai, 'selesai' => $sesi3Selesai], // Sesi 3 (Last)
        ];

        foreach ($sesiConfigsActive as $config) {
            $jamMulai = $config['mulai'];
            $jamSelesai = $config['selesai'];

            // Jadwal Penguji (OsceStase)
            foreach ($staseObjects as $index => $stase) {
                $penguji = $pengujis[$index % $pengujis->count()];
                $skenario = $daftarStase[$index]['skenario'];

                OsceStase::factory()->create([
                    'id_osce' => $osceActive->id_osce,
                    'id_stase' => $stase->id_stase,
                    'id_penguji' => $penguji->id_penguji,
                    'id_ruang' => $ruangs[$index]->id_ruang,
                    'tanggal' => $jamMulai->format('Y-m-d'),
                    'jam_mulai' => $jamMulai->format('H:i'),
                    'jam_selesai' => $jamSelesai->format('H:i'),
                    'durasi_per_mahasiswa' => $durasiPerMhs,
                    'skenario' => $skenario
                ]);
            }

            // Enroll Mahasiswa (Tanpa Nilai)
            foreach ($config['mahasiswas'] as $mhsData) {
                $mhsDb = Mahasiswa::where('nim', $mhsData['niu'])->first();
                if ($mhsDb) {
                    EnrollmentOsce::factory()->create([
                        'id_osce' => $osceActive->id_osce,
                        'id_mahasiswa' => $mhsDb->id_mahasiswa,
                        'tanggal_sesi' => $jamMulai->format('Y-m-d'),
                        'jam_sesi' => $jamMulai->format('H:i'),
                        'catatan' => null
                    ]);
                }
            }
        }

        // =====================================================================
        // 6. MAPPING JADWAL & PESERTA & NILAI (PAST EVENT)
        // =====================================================================

        // Jadwal Penguji (OsceStase) untuk Past Event (Satu Sesi Saja)
        foreach ($staseObjects as $index => $stase) {
            $penguji = $pengujis[$index % $pengujis->count()];
            $skenario = $daftarStase[$index]['skenario'];

            OsceStase::factory()->create([
                'id_osce' => $oscePast->id_osce,
                'id_stase' => $stase->id_stase,
                'id_penguji' => $penguji->id_penguji,
                'id_ruang' => $ruangs[$index]->id_ruang,
                'tanggal' => $pastSesiMulai->format('Y-m-d'),
                'jam_mulai' => $pastSesiMulai->format('H:i'),
                'jam_selesai' => $pastSesiSelesai->format('H:i'),
                'durasi_per_mahasiswa' => $durasiPerMhs,
                'skenario' => $skenario
            ]);
        }

        // Enroll Mahasiswa KLP 4 & Beri Nilai Variasi
        foreach ($klp4 as $idx => $mhsData) {
            $mhsDb = Mahasiswa::where('nim', $mhsData['niu'])->first();

            if ($mhsDb) {
                // Logika Variasi Nilai
                // Mahasiswa index 0-3: LULUS (Nilai Bagus)
                // Mahasiswa index 4-6: REMEDIAL (Nilai Jelek)
                $isLulus = $idx < 4;

                // Set catatan berdasarkan status kelulusan
                $catatan = $isLulus
                    ? 'Mahasiswa kompeten. Lulus ujian dengan baik.'
                    : 'Tidak kompeten pada beberapa prosedur. Wajib mengikuti REMIDI.';

                $enrollment = EnrollmentOsce::factory()->create([
                    'id_osce' => $oscePast->id_osce,
                    'id_mahasiswa' => $mhsDb->id_mahasiswa,
                    'tanggal_sesi' => $pastSesiMulai->format('Y-m-d'),
                    'jam_sesi' => $pastSesiMulai->format('H:i'),
                    'catatan' => $catatan
                ]);

                // Beri nilai untuk semua poin di semua stase (Simulasi full exam)
                foreach ($staseObjects as $stase) {
                    $aspeks = AspekPenilaian::where('id_stase', $stase->id_stase)->get();
                    foreach ($aspeks as $aspek) {
                        $points = PoinAspekPenilaian::where('id_aspek_penilaian', $aspek->id_aspek_penilaian)->get();
                        foreach ($points as $poin) {
                            // Skor: 0-4
                            // Lulus: Random 3 atau 4
                            // Gagal: Random 1 atau 2
                            $nilai = $isLulus ? rand(3, 4) : rand(1, 2);

                            NilaiOsce::factory()->create([
                                'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                                'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                                'nilai' => $nilai
                            ]);
                        }
                    }
                }
            }
        }
    }
}
