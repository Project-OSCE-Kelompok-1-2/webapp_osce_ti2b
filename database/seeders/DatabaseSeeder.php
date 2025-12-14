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
        // 1. DATA MASTER USER & MAHASISWA
        // =====================================================================
        $this->command->info('1. Membuat Data Master User & Mahasiswa...');

        LogoInstitusi::factory()->create([
            'nama_institusi' => 'Politeknik Negeri Semarang',
            'path_logo' => 'images/logo_polines.png',
            'deskripsi' => 'Program Studi Ilmu Keperawatan Fakultas Kedokteran, Kesehatan Masyarakat, dan Keperawatan',
        ]);

        $userAdmin = Pengguna::factory()->create(['username' => 'admin', 'jenis_role' => 'admin', 'password' => ('password')]);
        Admin::factory()->create(['id_pengguna' => $userAdmin->id_pengguna]);

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

        // ---------------------------------------------------------------------
        // ANGKATAN 2022/2023 (Total 28 Mahasiswa)
        // ---------------------------------------------------------------------

        // KELOMPOK 1 (Sesi 1)
        $angkatan22_klp1 = [
            ['niu' => '202201001', 'nama' => 'Dini Afiana'],
            ['niu' => '202201002', 'nama' => 'Arrifa Ilyana Cholarin'],
            ['niu' => '202201003', 'nama' => 'Merlina Dwi Wahyuni'],
            ['niu' => '202201004', 'nama' => 'Rahmatika Nuha Syafura'],
            ['niu' => '202201005', 'nama' => 'Petra Angelina G.P.'],
            ['niu' => '202201006', 'nama' => 'Melvia Dinda C.D.'],
            ['niu' => '202201007', 'nama' => 'Christine Chintia T.'],
        ];

        // KELOMPOK 2 (Sesi 2)
        $angkatan22_klp2 = [
            ['niu' => '202201008', 'nama' => 'Shelly Yolanda Putri'],
            ['niu' => '202201009', 'nama' => 'Alya Ramdhani'],
            ['niu' => '202201010', 'nama' => 'Nuriyatul Aini Sa\'diyah'],
            ['niu' => '202201011', 'nama' => 'Nadia Rizky Aliffia C.'],
            ['niu' => '202201012', 'nama' => 'Ratri Azzahra Utami'],
            ['niu' => '202201013', 'nama' => 'Ismi Maulfi Rahma'],
            ['niu' => '202201014', 'nama' => 'Herawati Kahartan'],
        ];

        // KELOMPOK 3 (Sesi 3)
        $angkatan22_klp3 = [
            ['niu' => '202201015', 'nama' => 'Alifa Cahya Nugraha'],
            ['niu' => '202201016', 'nama' => 'Syafira Nur Rosyida'],
            ['niu' => '202201017', 'nama' => 'Annisa Zulkha Avivah'],
            ['niu' => '202201018', 'nama' => 'Latifa Hanum Sabrina'],
            ['niu' => '202201019', 'nama' => 'Lolita Ayu Maharani'],
            ['niu' => '202201020', 'nama' => 'Velysia Irgi Novitasari'],
            ['niu' => '202201021', 'nama' => 'Aristya Salsabila'],
        ];

        // KELOMPOK 4 (Sesi 4)
        $angkatan22_klp4 = [
            ['niu' => '202201022', 'nama' => 'Riekha Yustiana'],
            ['niu' => '202201023', 'nama' => 'Annisa Nurlaila J.'],
            ['niu' => '202201024', 'nama' => 'Aulia Dewi Suryani'],
            ['niu' => '202201025', 'nama' => 'Cinta Kayla A.'],
            ['niu' => '202201026', 'nama' => 'Herla Afrisa C.'],
            ['niu' => '202201027', 'nama' => 'Annisa Nur Eka M.'],
            ['niu' => '202201028', 'nama' => 'Nafarum Chealsi E.'],
        ];

        // ---------------------------------------------------------------------
        // ANGKATAN 2023/2024 (Total 28 Mahasiswa)
        // ---------------------------------------------------------------------

        // KELOMPOK 1
        $angkatan23_klp1 = [
            ['niu' => '202301001', 'nama' => 'Aditya Pratama'],
            ['niu' => '202301002', 'nama' => 'Bella Puspita Sari'],
            ['niu' => '202301003', 'nama' => 'Citra Kirana'],
            ['niu' => '202301004', 'nama' => 'Dimas Anggara'],
            ['niu' => '202301005', 'nama' => 'Eka Putri Handayani'],
            ['niu' => '202301006', 'nama' => 'Fajar Nugraha'],
            ['niu' => '202301007', 'nama' => 'Gita Gutawa Putri'],
        ];

        // KELOMPOK 2
        $angkatan23_klp2 = [
            ['niu' => '202301008', 'nama' => 'Hendra Wijaya'],
            ['niu' => '202301009', 'nama' => 'Indah Permata'],
            ['niu' => '202301010', 'nama' => 'Joko Susilo'],
            ['niu' => '202301011', 'nama' => 'Kartika Sari'],
            ['niu' => '202301012', 'nama' => 'Lukman Hakim'],
            ['niu' => '202301013', 'nama' => 'Maya Angela'],
            ['niu' => '202301014', 'nama' => 'Nanda Putra'],
        ];

        // KELOMPOK 3
        $angkatan23_klp3 = [
            ['niu' => '202301015', 'nama' => 'Olivia Zalianty'],
            ['niu' => '202301016', 'nama' => 'Prasetyo Budi'],
            ['niu' => '202301017', 'nama' => 'Qory Sandioriva'],
            ['niu' => '202301018', 'nama' => 'Rian D' . "'Masiv"],
            ['niu' => '202301019', 'nama' => 'Siti Nurhaliza'],
            ['niu' => '202301020', 'nama' => 'Tio Pakusadewo'],
            ['niu' => '202301021', 'nama' => 'Umi Pipik'],
        ];

        // KELOMPOK 4
        $angkatan23_klp4 = [
            ['niu' => '202301022', 'nama' => 'Vina Panduwinata'],
            ['niu' => '202301023', 'nama' => 'Wawan Setiawan'],
            ['niu' => '202301024', 'nama' => 'Xaverius Chandra'],
            ['niu' => '202301025', 'nama' => 'Yuni Shara'],
            ['niu' => '202301026', 'nama' => 'Zainal Abidin'],
            ['niu' => '202301027', 'nama' => 'Agus Ringgo'],
            ['niu' => '202301028', 'nama' => 'Bunga Citra Lestari'],
        ];

        // ---------------------------------------------------------------------
        // ANGKATAN 2024/2025 (Total 28 Mahasiswa)
        // ---------------------------------------------------------------------

        // KELOMPOK 1
        $angkatan24_klp1 = [
            ['niu' => '202401001', 'nama' => 'Ahmad Dhani'],
            ['niu' => '202401002', 'nama' => 'Baim Wong'],
            ['niu' => '202401003', 'nama' => 'Celine Evangelista'],
            ['niu' => '202401004', 'nama' => 'Deddy Corbuzier'],
            ['niu' => '202401005', 'nama' => 'El Rumi'],
            ['niu' => '202401006', 'nama' => 'Fuji An'],
            ['niu' => '202401007', 'nama' => 'Gading Marten'],
        ];

        // KELOMPOK 2
        $angkatan24_klp2 = [
            ['niu' => '202401008', 'nama' => 'Harris Vriza'],
            ['niu' => '202401009', 'nama' => 'Irfan Hakim'],
            ['niu' => '202401010', 'nama' => 'Judika Sihotang'],
            ['niu' => '202401011', 'nama' => 'Kiky Saputri'],
            ['niu' => '202401012', 'nama' => 'Lesti Kejora'],
            ['niu' => '202401013', 'nama' => 'Melly Goeslaw'],
            ['niu' => '202401014', 'nama' => 'Nagita Slavina'],
        ];

        // KELOMPOK 3
        $angkatan24_klp3 = [
            ['niu' => '202401015', 'nama' => 'Olla Ramlan'],
            ['niu' => '202401016', 'nama' => 'Prilly Latuconsina'],
            ['niu' => '202401017', 'nama' => 'Qibil Changcuters'],
            ['niu' => '202401018', 'nama' => 'Raffi Ahmad'],
            ['niu' => '202401019', 'nama' => 'Sule Sutisna'],
            ['niu' => '202401020', 'nama' => 'Tulus Rusydi'],
            ['niu' => '202401021', 'nama' => 'Uya Kuya'],
        ];

        // KELOMPOK 4
        $angkatan24_klp4 = [
            ['niu' => '202401022', 'nama' => 'Vidi Aldiano'],
            ['niu' => '202401023', 'nama' => 'Wika Salim'],
            ['niu' => '202401024', 'nama' => 'Xena Xenita'],
            ['niu' => '202401025', 'nama' => 'Yura Yunita'],
            ['niu' => '202401026', 'nama' => 'Zaskia Gotik'],
            ['niu' => '202401027', 'nama' => 'Atta Halilintar'],
            ['niu' => '202401028', 'nama' => 'Boy William'],
        ];

        // ---------------------------------------------------------------------
        // ANGKATAN 2025/2026 (Total 28 Mahasiswa)
        // ---------------------------------------------------------------------

        // KELOMPOK 1
        $angkatan25_klp1 = [
            ['niu' => '202501001', 'nama' => 'Tiara Andini'],
            ['niu' => '202501002', 'nama' => 'Lyodra Ginting'],
            ['niu' => '202501003', 'nama' => 'Mahalini Raharja'],
            ['niu' => '202501004', 'nama' => 'Rizky Febian'],
            ['niu' => '202501005', 'nama' => 'Ziva Magnolya'],
            ['niu' => '202501006', 'nama' => 'Keisya Levronka'],
            ['niu' => '202501007', 'nama' => 'Nabila Taqiyyah'],
        ];

        // KELOMPOK 2
        $angkatan25_klp2 = [
            ['niu' => '202501008', 'nama' => 'Nyoman Paul'],
            ['niu' => '202501009', 'nama' => 'Rony Parulian'],
            ['niu' => '202501010', 'nama' => 'Salma Salsabil'],
            ['niu' => '202501011', 'nama' => 'Anggis Devaki'],
            ['niu' => '202501012', 'nama' => 'Raisa Syarla'],
            ['niu' => '202501013', 'nama' => 'Novia Situmeang'],
            ['niu' => '202501014', 'nama' => 'Kelvin Jojo'],
        ];

        // KELOMPOK 3
        $angkatan25_klp3 = [
            ['niu' => '202501015', 'nama' => 'Aziz Hedra'],
            ['niu' => '202501016', 'nama' => 'Aruma'],
            ['niu' => '202501017', 'nama' => 'Idgitaf'],
            ['niu' => '202501018', 'nama' => 'Dere'],
            ['niu' => '202501019', 'nama' => 'Raissa Anggiani'],
            ['niu' => '202501020', 'nama' => 'Fabio Asher'],
            ['niu' => '202501021', 'nama' => 'Bernadya'],
        ];

        // KELOMPOK 4
        $angkatan25_klp4 = [
            ['niu' => '202501022', 'nama' => 'Nadin Amizah'],
            ['niu' => '202501023', 'nama' => 'Hindia'],
            ['niu' => '202501024', 'nama' => 'Pamungkas'],
            ['niu' => '202501025', 'nama' => 'Fiersa Besari'],
            ['niu' => '202501026', 'nama' => 'Danilla Riyadi'],
            ['niu' => '202501027', 'nama' => 'Kunto Aji'],
            ['niu' => '202501028', 'nama' => 'Sal Priadi'],
        ];

        // Gabung semua mhs untuk create user di database (Total 28 * 4 = 112 Mahasiswa)
        // Kita simpan object mahasiswa per angkatan untuk logic enrollment nanti
        $mhsObjects22 = [];
        foreach (array_merge($angkatan22_klp1, $angkatan22_klp2, $angkatan22_klp3, $angkatan22_klp4) as $data) {
            $user = Pengguna::factory()->create(['username' => 'mhs.' . $data['niu'], 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
            $mhs = Mahasiswa::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama'], 'nim' => $data['niu'], 'prodi' => 'Ilmu Keperawatan']);
            $mhsObjects22[] = $mhs;
        }

        $mhsObjects23 = [];
        foreach (array_merge($angkatan23_klp1, $angkatan23_klp2, $angkatan23_klp3, $angkatan23_klp4) as $data) {
            $user = Pengguna::factory()->create(['username' => 'mhs.' . $data['niu'], 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
            $mhs = Mahasiswa::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama'], 'nim' => $data['niu'], 'prodi' => 'Ilmu Keperawatan']);
            $mhsObjects23[] = $mhs;
        }

        $mhsObjects24 = [];
        foreach (array_merge($angkatan24_klp1, $angkatan24_klp2, $angkatan24_klp3, $angkatan24_klp4) as $data) {
            $user = Pengguna::factory()->create(['username' => 'mhs.' . $data['niu'], 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
            $mhs = Mahasiswa::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama'], 'nim' => $data['niu'], 'prodi' => 'Ilmu Keperawatan']);
            $mhsObjects24[] = $mhs;
        }

        $mhsObjects25 = [];
        foreach (array_merge($angkatan25_klp1, $angkatan25_klp2, $angkatan25_klp3, $angkatan25_klp4) as $data) {
            $user = Pengguna::factory()->create(['username' => 'mhs.' . $data['niu'], 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
            $mhs = Mahasiswa::factory()->create(['id_pengguna' => $user->id_pengguna, 'nama' => $data['nama'], 'nim' => $data['niu'], 'prodi' => 'Ilmu Keperawatan']);
            $mhsObjects25[] = $mhs;
        }

        $allMhsObjects = array_merge($mhsObjects22, $mhsObjects23, $mhsObjects24, $mhsObjects25);

        // =====================================================================
        // 2. MASTER KURIKULUM & STASE (DEFINISI LENGKAP)
        // =====================================================================
        $this->command->info('2. Membuat Master Stase (Definisi Lengkap)...');

        $blok = Blok::factory()->create([
            'nama_blok' => 'Basic Nursing Skills 6 (BNS 6) Semester 5',
            'deskripsi' => 'Blok pembelajaran keterampilan klinis keperawatan semester 5 yang mencakup resusitasi, perawatan trauma, perioperatif, dan perawatan kritis.'
        ]);

        // Buat Mahasiswa Dummy untuk TA 2000/2001 (Pancingan)
        $userDummy = Pengguna::factory()->create(['username' => 'mhs.dummy', 'jenis_role' => 'mahasiswa', 'password' => ('password')]);
        $mhsDummy = Mahasiswa::factory()->create(['id_pengguna' => $userDummy->id_pengguna, 'nama' => 'Mahasiswa Dummy', 'nim' => '000000', 'prodi' => 'Ilmu Keperawatan']);

        // Buat dummy enrollment untuk mata kuliah agar tidak error (syarat foreign key)
        $taDummy = TahunAkademik::factory()->create(['tahun' => '2000/2001', 'semester' => 'Ganjil', 'status' => 'nonaktif']);
        $enrollmentDummy = Enrollment::factory()->create(['id_mahasiswa' => $mhsDummy->id_mahasiswa, 'id_tahun_akademik' => $taDummy->id_tahun_akademik]);

        $mk1 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $enrollmentDummy->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Gawat Darurat & Kardiovaskuler'
        ]);
        $mk2 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $enrollmentDummy->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Muskuloskeletal & Trauma'
        ]);
        $mk3 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $enrollmentDummy->id_enrollment,
            'nama_mata_kuliah' => 'Keperawatan Bedah Dasar'
        ]);
        $mk4 = MataKuliah::factory()->create([
            'id_blok' => $blok->id_blok,
            'id_enrollment' => $enrollmentDummy->id_enrollment,
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

        // 3. GENERATE STASE OBJECTS DI DATABASE
        $staseObjects = collect();
        $ruangs = collect();

        foreach ($daftarStase as $index => $dataStase) {
            // 1. Buat RUANG
            $ruang = Ruang::factory()->create([
                'nomor_ruangan' => 'R-' . ($index + 1),
                'lokasi' => $dataStase['ruang']
            ]);
            $ruangs->push($ruang);

            // 2. Buat STASE
            $stase = Stase::factory()->create([
                'id_mata_kuliah' => $dataStase['mk_id'],
                'nama_stase' => $dataStase['nama'],
                'deskripsi' => implode("\n", $dataStase['tujuan']) // Menggunakan tujuan sebagai deskripsi singkat
            ]);
            $staseObjects->push($stase);

            // 3. Buat TUJUAN PEMBELAJARAN
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
        // 4. GENERATE TAHUN AKADEMIK & EVENT OSCE (LOOPING TAHUN)
        // =====================================================================
        $this->command->info('4. Generate Event OSCE & Enrollments...');

        $waktuEksekusi = Carbon::now('Asia/Jakarta');

        $listTahun = [
            ['tahun' => '2022/2023', 'semester' => 'Ganjil', 'active' => false],
            ['tahun' => '2022/2023', 'semester' => 'Genap', 'active' => false],
            ['tahun' => '2023/2024', 'semester' => 'Ganjil', 'active' => false],
            ['tahun' => '2023/2024', 'semester' => 'Genap', 'active' => false],
            ['tahun' => '2024/2025', 'semester' => 'Ganjil', 'active' => false],
            ['tahun' => '2024/2025', 'semester' => 'Genap', 'active' => false],
            ['tahun' => '2025/2026', 'semester' => 'Ganjil', 'active' => true], // Target Active
        ];

        foreach ($listTahun as $thn) {
            $isCurrent = $thn['active'];
            $statusTa = $isCurrent ? 'aktif' : 'nonaktif';

            $this->command->info("Processing TA: {$thn['tahun']} {$thn['semester']} ($statusTa)");

            // A. Create TA
            $ta = TahunAkademik::factory()->create([
                'tahun' => $thn['tahun'],
                'semester' => $thn['semester'],
                'status' => $statusTa
            ]);

            $yearStart = intval(substr($thn['tahun'], 0, 4));

            // Filter students active in this academic year
            $activeStudents = [];

            // Logic: Student Entry Year <= Academic Year Start
            if (2022 <= $yearStart) {
                $activeStudents = array_merge($activeStudents, $mhsObjects22);
            }
            if (2023 <= $yearStart) {
                $activeStudents = array_merge($activeStudents, $mhsObjects23);
            }
            if (2024 <= $yearStart) {
                $activeStudents = array_merge($activeStudents, $mhsObjects24);
            }
            if (2025 <= $yearStart) {
                $activeStudents = array_merge($activeStudents, $mhsObjects25);
            }

            // B. Enroll Active Mahasiswa ke TA ini
            foreach ($activeStudents as $mhs) {
                Enrollment::factory()->create([
                    'id_mahasiswa' => $mhs->id_mahasiswa,
                    'id_tahun_akademik' => $ta->id_tahun_akademik
                ]);
            }

            // C. LOGIKA SKENARIO
            if ($isCurrent) {
                // =============================================================
                // SKENARIO ACTIVE (2025/2026 Ganjil) - Detail Sesi
                // =============================================================

                // Gunakan SEMUA mahasiswa aktif ($activeStudents) untuk skenario Active.
                // Total Mahasiswa = 112 orang (28 * 4 angkatan).
                // Dibagi per sesi = 7 orang.
                // Total Sesi = 16 Sesi.

                $durasiPerMhs = 7;
                $jumlahMhsPerSesi = 7;
                $durasiSesi = $durasiPerMhs * $jumlahMhsPerSesi; // ~49 menit

                // Bagi mahasiswa menjadi batch (sesi)
                $studentBatches = array_chunk($activeStudents, $jumlahMhsPerSesi);
                $totalSesi = count($studentBatches); // Sekitar 16 sesi

                // Tentukan sesi mana yang sedang "Active" (Sedang berlangsung)
                // Kita ambil index ke-6 (Sesi ke-7) sebagai sesi yang sedang berjalan agar terlihat variasi (ada yg sudah selesai, ada yg belum)
                $currentActiveSessionIndex = 6; // 0-based index. Jadi sesi index 6 adalah sesi ke-7.

                /// Hitung waktu mulai untuk sesi pertama (Index 0)
                // Agar Sesi ke-6 (Active) mulai tepat "sekarang" atau "beberapa menit lagi".
                // Start Sesi Active = Now + 5 menit.
                // Start Sesi 0 = Start Sesi Active - (6 * (Durasi Sesi + Break))
                $breakTime = 15; // Jeda antar sesi 15 menit
                $minutesOffset = $currentActiveSessionIndex * ($durasiSesi + $breakTime);

                // Waktu mulai seluruh rangkaian OSCE (Sesi 0)
                $startTimeAll = $waktuEksekusi->copy()->subMinutes($minutesOffset)->addMinutes(5); // Mundur sedikit biar sesi active sudah jalan 5 menit

                // Waktu selesai seluruh rangkaian (Estimasi sesi terakhir selesai)
                $totalMinutesAll = $totalSesi * ($durasiSesi + $breakTime);
                $endTimeAll = $startTimeAll->copy()->addMinutes($totalMinutesAll);

                // --- 1. Buat Event OSCE ACTIVE ---
                $osceActive = Osce::factory()->create([
                    'id_tahun_akademik' => $ta->id_tahun_akademik,
                    'nama_osce' => "OSCE BNS 6 {$thn['tahun']} (Active)",
                    'tanggal_mulai' => $startTimeAll->format('Y-m-d H:i:s'),
                    'tanggal_selesai' => $endTimeAll->format('Y-m-d H:i:s'),
                ]);

                // --- 2. Loop Setiap Batch (Sesi) ---
                foreach ($studentBatches as $batchIndex => $batchStudents) {
                    // Hitung waktu spesifik sesi ini
                    $sessionOffset = $batchIndex * ($durasiSesi + $breakTime);
                    $sesiMulai = $startTimeAll->copy()->addMinutes($sessionOffset);
                    $sesiSelesai = $sesiMulai->copy()->addMinutes($durasiSesi);

                    // Tentukan Status: History (Sudah lewat) atau Future/Active
                    // Jika sesiSelesai < Now => History (Sudah dinilai)
                    $isHistory = $sesiSelesai->lt($waktuEksekusi);

                    // --- Buat Jadwal Penguji (OsceStase) untuk Sesi Ini ---
                    foreach ($staseObjects as $idx => $stase) {
                        $penguji = $pengujis[$idx % $pengujis->count()];
                        OsceStase::factory()->create([
                            'id_osce' => $osceActive->id_osce,
                            'id_stase' => $stase->id_stase,
                            'id_penguji' => $penguji->id_penguji,
                            'id_ruang' => $ruangs[$idx]->id_ruang,
                            'tanggal' => $sesiMulai->format('Y-m-d'),
                            'jam_mulai' => $sesiMulai->format('H:i'),
                            'jam_selesai' => $sesiSelesai->format('H:i'),
                            'durasi_per_mahasiswa' => $durasiPerMhs,
                            'skenario' => $daftarStase[$idx]['skenario']
                        ]);
                    }

                    // --- Enroll Mahasiswa di Sesi Ini ---
                    foreach ($batchStudents as $mhsObj) {
                        $catatan = null;
                        $isLulus = true; // Default lulus

                        if ($isHistory) {
                            // Random kelulusan untuk data history
                            $isLulus = rand(1, 10) <= 8;
                            $catatan = $isLulus ? 'Kompeten.' : 'Remedial.';
                        }

                        $enrol = EnrollmentOsce::factory()->create([
                            'id_osce' => $osceActive->id_osce,
                            'id_mahasiswa' => $mhsObj->id_mahasiswa,
                            'tanggal_sesi' => $sesiMulai->format('Y-m-d'),
                            'jam_sesi' => $sesiMulai->format('H:i'),
                            'catatan' => $catatan
                        ]);

                        // Jika sesi sudah lewat (History), beri nilai langsung
                        if ($isHistory) {
                            $this->beriNilai($enrol->id_enrollment_osce, $staseObjects, $isLulus);
                        }
                    }
                }
            } else {
                // =============================================================
                // SKENARIO PAST YEARS (History Penuh untuk Semua Mahasiswa)
                // =============================================================
                // Tentukan tanggal masa lalu berdasarkan tahunnya

                $yearStart = intval(substr($thn['tahun'], 0, 4));
                $datePast = Carbon::create($yearStart, 11, 15, 8, 0, 0); // Mulai jam 08:00

                // Durasi per sesi (7 mhs * 7 menit = 49 menit) + Buffer = 60 menit per sesi
                $durasiPerSesi = 60;

                // Total Mahasiswa = 84. Chunk 7 = 12 Sesi. 
                // Kita buat durasi osce cukup panjang untuk cover semua sesi
                $oscePast = Osce::factory()->create([
                    'id_tahun_akademik' => $ta->id_tahun_akademik,
                    'nama_osce' => "OSCE Final {$thn['tahun']} {$thn['semester']}",
                    'tanggal_mulai' => $datePast->format('Y-m-d H:i:s'),
                    'tanggal_selesai' => $datePast->copy()->addHours(15)->format('Y-m-d H:i:s'),
                ]);

                // Bagi mahasiswa menjadi chunk @ 7 orang (Total 12 Sesi untuk 84 Mahasiswa)
                // Use $activeStudents instead of $allMhsObjects
                $studentChunks = array_chunk($activeStudents, 7);

                foreach ($studentChunks as $sessionIndex => $batchStudents) {
                    // Hitung waktu sesi ini
                    $sessionStart = $datePast->copy()->addMinutes($sessionIndex * $durasiPerSesi);
                    $sessionEnd = $sessionStart->copy()->addMinutes($durasiPerSesi);

                    // 1. Buat Jadwal (OsceStase) untuk sesi ini
                    foreach ($staseObjects as $idx => $stase) {
                        OsceStase::factory()->create([
                            'id_osce' => $oscePast->id_osce,
                            'id_stase' => $stase->id_stase,
                            'id_penguji' => $pengujis[$idx % $pengujis->count()]->id_penguji,
                            'id_ruang' => $ruangs[$idx]->id_ruang,
                            'tanggal' => $sessionStart->format('Y-m-d'),
                            'jam_mulai' => $sessionStart->format('H:i'),
                            'jam_selesai' => $sessionEnd->format('H:i'),
                            'durasi_per_mahasiswa' => 7,
                            'skenario' => $daftarStase[$idx]['skenario']
                        ]);
                    }

                    // 2. Enroll Mahasiswa di batch ini ke sesi ini
                    foreach ($batchStudents as $mhsObj) {
                        // Random Lulus/Tidak (80% Lulus)
                        $isLulus = rand(1, 10) <= 8;

                        $enrol = EnrollmentOsce::factory()->create([
                            'id_osce' => $oscePast->id_osce,
                            'id_mahasiswa' => $mhsObj->id_mahasiswa,
                            'tanggal_sesi' => $sessionStart->format('Y-m-d'),
                            'jam_sesi' => $sessionStart->format('H:i'),
                            'catatan' => $isLulus ? 'Lulus dengan baik.' : 'Perlu perbaikan di beberapa aspek.'
                        ]);

                        $this->beriNilai($enrol->id_enrollment_osce, $staseObjects, $isLulus);
                    }
                }
            }
        }
    }

    /**
     * Helper Function untuk generate nilai acak
     */
    private function beriNilai($idEnrollmentOsce, $staseObjects, $isLulus)
    {
        foreach ($staseObjects as $stase) {
            $aspeks = AspekPenilaian::where('id_stase', $stase->id_stase)->get();
            foreach ($aspeks as $aspek) {
                $points = PoinAspekPenilaian::where('id_aspek_penilaian', $aspek->id_aspek_penilaian)->get();
                foreach ($points as $poin) {
                    // Skor: 3-4 (Lulus), 1-2 (Gagal)
                    $nilai = $isLulus ? rand(3, 4) : rand(1, 2);

                    NilaiOsce::factory()->create([
                        'id_enrollment_osce' => $idEnrollmentOsce,
                        'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                        'nilai' => $nilai
                    ]);
                }
            }
        }
    }
}
