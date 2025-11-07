<?php

namespace Tests\Feature;

use App\Models\Pengguna;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\Mahasiswa;
use App\Models\EnrollmentOsce;
use App\Models\Stase;
use App\Models\AspekPenilaian;
use App\Models\PoinAspekPenilaian;
use App\Models\NilaiOsce;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RekapNilaiDetailTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $mahasiswa;
    private $osce;
    private $osceStase;
    private $enrollment;
    private $nilai;
    private $poin;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup data kompleks
        $this->admin = Pengguna::factory()->create(['jenis_role' => 'admin']);
        $this->osce = Osce::factory()->create();
        
        // Buat Mahasiswa & daftarkan
        $this->mahasiswa = Mahasiswa::factory()->create();
        $this->enrollment = EnrollmentOsce::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_mahasiswa' => $this->mahasiswa->id_mahasiswa
        ]);
        
        // Buat struktur penilaian
        $stase = Stase::factory()->create(['nama_stase' => 'Stase Septia']);
        $aspek = AspekPenilaian::factory()->create(['id_stase' => $stase->id_stase, 'aspek' => 'Aspek Septia']);
        $this->poin = PoinAspekPenilaian::factory()->create([
            'id_aspek_penilaian' => $aspek->id_aspek_penilaian,
            'kompetensi' => 'Kompetensi Septia'
        ]);
        
        // Buat osce_stase sebagai "sesi" (asumsi id_sesi = id_osce_stase)
        $this->osceStase = OsceStase::factory()->create([
            'id_osce' => $this->osce->id_osce,
            'id_stase' => $stase->id_stase
        ]);

        // Beri nilai
        $this->nilai = NilaiOsce::factory()->create([
            'id_enrollment_osce' => $this->enrollment->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $this->poin->id_poin_aspek_penilaian,
            'nilai' => 95
        ]);
    }
    
    /** @test */
    public function septia_tugas1_admin_can_view_rekap_mahasiswa_list()
    {
        // Endpoint dari Props Contract (asumsi {id_sesi} = {id_osce_stase})
        $endpoint = "/admin/rekap-nilai/{$this->osce->id_osce}/sesi/{$this->osceStase->id_osce_stase}/mahasiswa";

        $this->actingAs($this->admin)
            ->get($endpoint)
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                $assert->component('Admin/RekapMahasiswaPage') // Asumsi
                       ->has('mahasiswa.data', 1)
                       ->has('mahasiswa.data.0', function ($props) {
                           $props->where('nim', $this->mahasiswa->nim)
                                 ->hasAll(['id_mahasiswa', 'nim', 'nama']);
                       });
            });
    }

    /** @test */
    public function septia_tugas2_admin_can_view_detail_nilai_mahasiswa()
    {
        // Endpoint dari Props Contract
        $endpoint = "/admin/rekap-nilai/mahasiswa/{$this->mahasiswa->id_mahasiswa}/osce/{$this->osce->id_osce}";

        $this->actingAs($this->admin)
            ->get($endpoint)
            ->assertStatus(200)
            ->assertInertia(function ($assert) {
                // Cek struktur JSON props Contract
                $assert->component('Admin/RekapDetailPage') // Asumsi
                       ->has('detailNilai', function ($props) {
                            $props->where('mahasiswa.nim', $this->mahasiswa->nim)
                                  ->where('osce.nama_osce', $this->osce->nama_osce)
                                  ->where('nilai_per_stase.0.nama_stase', 'Stase Septia')
                                  ->where('nilai_per_stase.0.aspek_penilaian.0.aspek', 'Aspek Septia')
                                  ->where('nilai_per_stase.0.aspek_penilaian.0.kompetensi.0.kompetensi', 'Kompetensi Septia')
                                  ->where('nilai_per_stase.0.aspek_penilaian.0.kompetensi.0.nilai', 95.0); // Cek nilainya
                       });
            });
    }
}