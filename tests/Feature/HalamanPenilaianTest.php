<?php

namespace Tests\Feature\Penguji;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\Pengguna;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\Osce;
use App\Models\Stase;
use App\Models\Ruang;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Models\TahunAkademik;
use Illuminate\Support\Facades\Config;

class HalamanPenilaianTest extends TestCase
{
    use RefreshDatabase;

    protected $penguji;
    protected $userPenguji;
    protected $osce;
    protected $stase;
    protected $ruang;
    protected $osceStase;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Bypass Vite Manifest Error
        $this->withoutVite();

        // 2. Bypass Physical File Check
        Config::set('inertia.testing.ensure_pages_exist', false);

        // --- SETUP DATA UTAMA ---
        $this->userPenguji = Pengguna::factory()->create(['jenis_role' => 'penguji']);
        $this->penguji = Penguji::factory()->create(['id_pengguna' => $this->userPenguji->id_pengguna]);

        $ta = TahunAkademik::factory()->create();
        $this->osce = Osce::factory()->create([
            'id_tahun_akademik' => $ta->id_tahun_akademik,
            'nama_osce' => 'OSCE Radiologi Final'
        ]);
        $this->stase = Stase::factory()->create(['nama_stase' => 'Stase CT Scan']);
        $this->ruang = Ruang::factory()->create(['nomor_ruangan' => '05']);

        // Assign Penguji ke Stase ini
        $this->osceStase = OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $this->stase->id_stase,
            'id_ruang' => $this->ruang->id_ruang,
            'id_penguji' => $this->penguji->id_penguji,
            'durasi_per_mahasiswa' => 30
        ]);
    }

    /** @test */
    public function penguji_bisa_melihat_detail_antrian_dengan_sorting_dan_status_presisi()
    {
        $mhsC = Mahasiswa::factory()->create(['nama' => 'Caca', 'nim' => '300']);
        $mhsA = Mahasiswa::factory()->create(['nama' => 'Andi', 'nim' => '100']);
        $mhsB = Mahasiswa::factory()->create(['nama' => 'Budi', 'nim' => '200']);

        EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhsC->id_mahasiswa]);
        $enrollA = EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhsA->id_mahasiswa]);
        EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhsB->id_mahasiswa]);

        $aspek = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase]);
        $poin = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);
        NilaiOsce::factory()->create([
            'id_enrollment_osce' => $enrollA->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
            'nilai' => 4
        ]);

        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.antrian', [
                'id_osce' => $this->osce->id_osce,
                'id_osce_stase' => $this->osceStase->id_osce_stase
            ]));

        $response->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Penguji/Antrian')
                    ->where('osce_detail.nama_osce', 'OSCE Radiologi Final')
                    ->where('osce_detail.nomor_stasiun', '05')
                    ->where('osce_detail.total_mahasiswa', 3)
                    ->has('antrian_mahasiswa', 3)
                    ->where('antrian_mahasiswa.0.nim', '100')
                    ->where('antrian_mahasiswa.0.status_penilaian', 'Sudah Dinilai')
                    ->where('antrian_mahasiswa.1.nim', '200')
                    ->where('antrian_mahasiswa.1.status_penilaian', 'Belum Dinilai')
                    ->where('antrian_mahasiswa.2.nim', '300')
            );
    }

    /** @test */
    public function halaman_penilaian_memuat_struktur_rubrik_dan_data_mahasiswa_dengan_lengkap()
    {
        $mhs = Mahasiswa::factory()->create(['nama' => 'Siti', 'nim' => '555']);
        $enroll = EnrollmentOsce::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $mhs->id_mahasiswa
        ]);

        $aspek1 = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase, 'aspek' => 'Anamnesis']);
        $poin1A = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek1->id_aspek_penilaian, 'kompetensi' => 'Salam', 'bobot' => 5]);
        $aspek2 = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase, 'aspek' => 'Fisik']);
        $poin2A = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek2->id_aspek_penilaian, 'kompetensi' => 'Periksa', 'bobot' => 10]);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enroll->id_enrollment_osce]));

        $response->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Penguji/Penilaian')
                    ->where('mahasiswa.nama', 'Siti')
                    ->where('mahasiswa.nim', '555')
                    ->where('info_ujian.nama_osce', 'OSCE Radiologi Final')
                    ->where('info_ujian.nama_stase', 'Stase CT Scan')
                    ->where('sisa_waktu_detik', 1800)
                    ->has('rubrik', 2)
                    ->where('rubrik.0.aspek', 'Anamnesis')
                    ->where('rubrik.0.kompetensi.0.id_poin_aspek_penilaian', $poin1A->id_poin_aspek_penilaian)
            );
    }

    /** @test */
    public function kalkulasi_nilai_server_side_akurat_termasuk_bobot_desimal()
    {
        $mhs = Mahasiswa::factory()->create();
        $enroll = EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhs->id_mahasiswa]);

        $aspek = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase]);
        $poinA = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian, 'bobot' => 13]);
        $poinB = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian, 'bobot' => 20]);
        $poinC = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian, 'bobot' => 50]);

        NilaiOsce::factory()->create(['id_enrollment_osce' => $enroll->id_enrollment_osce, 'id_poin_aspek_penilaian' => $poinA->id_poin_aspek_penilaian, 'nilai' => 3]);
        NilaiOsce::factory()->create(['id_enrollment_osce' => $enroll->id_enrollment_osce, 'id_poin_aspek_penilaian' => $poinB->id_poin_aspek_penilaian, 'nilai' => 0]);
        NilaiOsce::factory()->create(['id_enrollment_osce' => $enroll->id_enrollment_osce, 'id_poin_aspek_penilaian' => $poinC->id_poin_aspek_penilaian, 'nilai' => 4]);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enroll->id_enrollment_osce]));

        $response->assertInertia(
            fn(Assert $page) => $page
                ->component('Penguji/Penilaian')
                ->has('saved_scores', 3)
                ->where('saved_scores.' . $poinB->id_poin_aspek_penilaian, 0)
                ->where('calculation_summary.total_akumulasi', 239)
                ->where('calculation_summary.formula_pembagi', 4)
                ->where('total_nilai_server', "59.75")
        );
    }

    /** @test */
    public function penguji_tidak_bisa_akses_rubrik_stase_lain_meski_di_osce_yang_sama()
    {
        $pengujiB = Penguji::factory()->create();
        $staseB = Stase::factory()->create(['nama_stase' => 'Stase Anak']);

        OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $staseB->id_stase,
            'id_penguji' => $pengujiB->id_penguji
        ]);

        $enroll = EnrollmentOsce::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa
        ]);

        $aspekStaseSaya = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase, 'aspek' => 'Aspek Saya']);
        $aspekStaseOrang = AspekPenilaian::factory()->create(['id_stase' => $staseB->id_stase, 'aspek' => 'Aspek Orang Lain']);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enroll->id_enrollment_osce]));

        $response->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Penguji/Penilaian')
                    ->has('rubrik', 1)
                    ->where('rubrik.0.aspek', 'Aspek Saya')
            );
    }

    /** @test */
    public function penguji_mendapat_404_jika_mencoba_menilai_mahasiswa_dari_osce_berbeda()
    {
        $osceLain = Osce::factory()->create();
        $enrollLain = EnrollmentOsce::factory()->create([
            'id_osce' => $osceLain->id_osce,
            'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa
        ]);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enrollLain->id_enrollment_osce]))
            ->assertStatus(404);
    }

    /** @test */
    public function validasi_keamanan_guest_dan_role_lain()
    {
        $this->get(route('penguji.antrian', ['id_osce' => 1, 'id_osce_stase' => 1]))
            ->assertRedirect(route('login'));

        /** @var \App\Models\Pengguna $userMhs */
        $userMhs = Pengguna::factory()->create(['jenis_role' => 'mahasiswa']);
        $this->actingAs($userMhs)
            ->get(route('penguji.antrian', ['id_osce' => 1, 'id_osce_stase' => 1]))
            ->assertStatus(302);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $this->actingAs($userMhs)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => 1]))
            ->assertStatus(302);
    }

    /** @test */
    public function integritas_tipe_data_respon_json()
    {
        $mhs = Mahasiswa::factory()->create();
        $enroll = EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhs->id_mahasiswa]);

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enroll->id_enrollment_osce]));

        $response->assertInertia(
            fn(Assert $page) => $page
                ->whereType('id_enrollment_osce', 'integer')
                ->whereType('sisa_waktu_detik', 'integer')
                ->whereType('saved_scores', 'array')
                ->whereType('total_nilai_server', 'string')
        );
    }

    /** @test */
    public function alur_penilaian_berurutan_dari_mahasiswa_A_ke_B()
    {
        $mhsA = Mahasiswa::factory()->create(['nama' => 'Andi']);
        $mhsB = Mahasiswa::factory()->create(['nama' => 'Budi']);

        $enrollA = EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhsA->id_mahasiswa]);
        $enrollB = EnrollmentOsce::factory()->create(['id_osce' => $this->osce->id_osce, 'id_mahasiswa' => $mhsB->id_mahasiswa]);

        $aspek = AspekPenilaian::factory()->create(['id_stase' => $this->stase->id_stase]);
        $poin = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);

        $response1 = $this->actingAs($this->userPenguji)
            ->get(route('penguji.antrian', ['id_osce' => $this->osce->id_osce, 'id_osce_stase' => $this->osceStase->id_osce_stase]));

        $response1->assertInertia(
            fn(Assert $page) => $page
                ->where('antrian_mahasiswa.0.status_penilaian', 'Belum Dinilai')
                ->where('antrian_mahasiswa.1.status_penilaian', 'Belum Dinilai')
        );

        NilaiOsce::factory()->create([
            'id_enrollment_osce' => $enrollA->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
            'nilai' => 4
        ]);

        $response2 = $this->actingAs($this->userPenguji)
            ->get(route('penguji.antrian', ['id_osce' => $this->osce->id_osce, 'id_osce_stase' => $this->osceStase->id_osce_stase]));

        $response2->assertInertia(
            fn(Assert $page) => $page
                ->where('antrian_mahasiswa.0.status_penilaian', 'Sudah Dinilai')
                ->where('antrian_mahasiswa.1.status_penilaian', 'Belum Dinilai')
        );

        // [UPDATE] Gunakan 'penguji.penilaian.show'
        $response3 = $this->actingAs($this->userPenguji)
            ->get(route('penguji.penilaian.show', ['id_enrollment_osce' => $enrollB->id_enrollment_osce]));

        $response3->assertInertia(
            fn(Assert $page) => $page
                ->has('saved_scores', 0)
                ->where('total_nilai_server', "0.00")
        );
    }

    /** @test */
    public function penguji_tidak_bisa_mengintip_antrian_stase_milik_penguji_lain()
    {
        $pengujiLain = Penguji::factory()->create();
        $staseLain = Stase::factory()->create();

        $osceStaseLain = OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $staseLain->id_stase,
            'id_penguji' => $pengujiLain->id_penguji
        ]);

        $response = $this->actingAs($this->userPenguji)
            ->get(route('penguji.antrian', [
                'id_osce' => $this->osce->id_osce,
                'id_osce_stase' => $osceStaseLain->id_osce_stase
            ]));

        $response->assertStatus(404);
    }
}
