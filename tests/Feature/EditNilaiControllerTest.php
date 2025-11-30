<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Osce;
use App\Models\Stase;
use App\Models\Ruang;
use App\Models\Pengguna;
use App\Models\Penguji;
use App\Models\NilaiOsce;
use App\Models\Mahasiswa;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EditNilaiControllerTest extends TestCase
{
    use RefreshDatabase;

    private $pengujiAkun;
    private $penguji;
    private $enrollment;
    private $poin1;
    private $poin2;
    private $stase;
    private $osce;

    protected function setUp(): void
    {
        parent::setUp();

        /**
         * 1. Buat akun pengguna untuk penguji
         */
        $this->pengujiAkun = Pengguna::factory()->create([
            'jenis_role' => 'penguji',
            'username'   => 'dosen_test',
            'password'   => bcrypt('password'),
        ]);

        /**
         * 2. Buat entry tabel penguji
         */
        $this->penguji = Penguji::create([
            'id_pengguna' => $this->pengujiAkun->id_pengguna,
            'nama'        => 'Dosen Penguji',
            'nip'         => '1987654321'
        ]);

        /**
         * 3. Mahasiswa, OSCE, Stase
         */
        $mahasiswa = Mahasiswa::factory()->create([
            'nama' => 'Mahasiswa Test',
            'nim'  => '12345'
        ]);

        $this->osce = Osce::factory()->create([
            'nama_osce' => 'OSCE Test 1'
        ]);

        $this->stase = Stase::factory()->create([
            'nama_stase' => 'Stase Bedah'
        ]);

        /**
         * 4. Buat ruang karena id_ruang wajib
         */
        $ruang = Ruang::create([
            'nomor_ruangan' => 'R101',
            'lokasi'        => 'Gedung A Lantai 2'
        ]);

        /**
         * 5. OSCE_STASE wajib lengkap seluruh kolom
         */
        OsceStase::create([
            'id_osce'    => $this->osce->id_osce,
            'id_stase'   => $this->stase->id_stase,
            'id_penguji' => $this->penguji->id_penguji,  // BENAR
            'id_ruang'   => $ruang->id_ruang,            // WAJIB
            'tanggal'    => now(),
            'jam_mulai'  => '08:00',
            'jam_selesai'=> '12:00',
            'skenario'   => 'Skenario OSCE Test',
            'durasi_per_mahasiswa' => 10,
        ]);

        /**
         * 6. Aspek & Poin Penilaian
         */
        $aspek = AspekPenilaian::create([
            'id_stase'       => $this->stase->id_stase,
            'aspek'          => 'Anamnesis',
            'bobot_maksimum' => 20
        ]);

        $this->poin1 = PoinAspekPenilaian::create([
            'id_aspek_penilaian' => $aspek->id_aspek_penilaian,
            'kompetensi'         => 'Menanyakan Keluhan Utama',
            'skor'               => 4,
            'bobot'              => 10
        ]);

        $this->poin2 = PoinAspekPenilaian::create([
            'id_aspek_penilaian' => $aspek->id_aspek_penilaian,
            'kompetensi'         => 'Riwayat Penyakit',
            'skor'               => 4,
            'bobot'              => 10
        ]);

        /**
         * 7. Enrollment
         */
        $this->enrollment = EnrollmentOsce::create([
            'id_osce'      => $this->osce->id_osce,
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
        ]);
    }

    /** @test */
    public function najwa_tugas1_penguji_can_get_form_edit_with_rubric()
    {
        $response = $this->actingAs($this->pengujiAkun)
            ->getJson(route('penguji.penilaian.edit', $this->enrollment->id_enrollment_osce));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id_enrollment_osce',
                    'mahasiswa' => ['nama', 'nim'],
                    'info_stase' => ['nama_stase'],
                    'penilaian' => [
                        '*' => [
                            'nama_aspek',
                            'kompetensi_list' => [
                                '*' => [
                                    'id_poin_aspek_penilaian',
                                    'kompetensi',
                                    'skor_maksimal',
                                    'nilai_input'
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

        $response->assertJsonFragment([
            'kompetensi' => 'Menanyakan Keluhan Utama'
        ]);
    }

    /** @test */
    public function najwa_tugas2_penguji_can_save_and_update_nilai()
    {
        // INSERT NILAI
        $payload = [
            'items' => [
                [
                    'id_poin_aspek_penilaian' => $this->poin1->id_poin_aspek_penilaian,
                    'nilai' => 4
                ],
                [
                    'id_poin_aspek_penilaian' => $this->poin2->id_poin_aspek_penilaian,
                    'nilai' => 2
                ]
            ]
        ];

        $this->actingAs($this->pengujiAkun)
            ->putJson(route('penguji.penilaian.update', $this->enrollment->id_enrollment_osce), $payload)
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('nilai_osce', [
            'id_enrollment_osce'       => $this->enrollment->id_enrollment_osce,
            'id_poin_aspek_penilaian'  => $this->poin1->id_poin_aspek_penilaian,
            'nilai'                    => 4
        ]);

        // UPDATE NILAI
        $payloadUpdate = [
            'items' => [
                [
                    'id_poin_aspek_penilaian' => $this->poin1->id_poin_aspek_penilaian,
                    'nilai' => 3
                ]
            ]
        ];

        $this->actingAs($this->pengujiAkun)
            ->putJson(route('penguji.penilaian.update', $this->enrollment->id_enrollment_osce), $payloadUpdate)
            ->assertStatus(200);

        $this->assertDatabaseHas('nilai_osce', [
            'id_enrollment_osce'      => $this->enrollment->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $this->poin1->id_poin_aspek_penilaian,
            'nilai'                   => 3
        ]);

        // Total tetap 2
        $count = NilaiOsce::where('id_enrollment_osce', $this->enrollment->id_enrollment_osce)->count();
        $this->assertEquals(2, $count);
    }

    /** @test */
    public function najwa_tugas2_validation_check()
    {
        $payloadError = [
            'items' => [
                [
                    'id_poin_aspek_penilaian' => $this->poin1->id_poin_aspek_penilaian,
                    'nilai' => -5
                ]
            ]
        ];

        $response = $this->actingAs($this->pengujiAkun)
            ->putJson(route('penguji.penilaian.update', $this->enrollment->id_enrollment_osce), $payloadError);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.nilai']);
    }
}
