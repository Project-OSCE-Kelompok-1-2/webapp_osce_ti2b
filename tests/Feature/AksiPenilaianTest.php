<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Pengguna;
use App\Models\Mahasiswa;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\EnrollmentOsce;
use App\Models\PoinAspekPenilaian;
use App\Models\NilaiOsce;
use App\Models\AspekPenilaian;
use App\Models\Stase; 
use App\Models\Penguji;
use App\Models\Ruang; 
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class AksiPenilaianTest extends TestCase
{
    use RefreshDatabase;

    protected $pengguna;
    protected $pengujiModel;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->pengguna = Pengguna::factory()->create(['jenis_role' => 'penguji']);
        $this->pengujiModel = Penguji::factory()->create(['id_pengguna' => $this->pengguna->id_pengguna]);
        $this->actingAs($this->pengguna); 
    }

    private function createOsceStructure(int $poinCount = 3)
    {
        $osce = Osce::factory()->create(['tanggal_selesai' => now()->addDay()]); 
        $staseModel = Stase::factory()->create();
        $aspekPenilaian = AspekPenilaian::factory()->create(['id_stase' => $staseModel->id_stase]);

        $poinPenilaian = PoinAspekPenilaian::factory()->count($poinCount)->create([
            'id_aspek_penilaian' => $aspekPenilaian->id_aspek_penilaian,
        ]);
        
        $osceStase = OsceStase::create([
            'id_osce' => $osce->id_osce,
            'id_stase' => $staseModel->id_stase,
            'id_penguji' => $this->pengujiModel->id_penguji,
            'id_ruang' => Ruang::factory()->create()->id_ruang, 
            'tanggal' => now()->addDays(5)->toDateString(),
            'jam_mulai' => '08:00',
            'jam_selesai' => '09:00',
        ]);

        return [$osce, $osceStase, $poinPenilaian];
    }

    #[Test]
    public function simpan_nilai_berhasil_dan_rotasi_ke_mahasiswa_berikutnya()
    {
        [$osce, $stase, $poinPenilaian] = $this->createOsceStructure(2);
        
        // Buat 2 enrollment. B dinilai, lalu rotasi ke A.
        $enrollmentB = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);
        $enrollmentA = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);

        $payload = [
            'nilai' => $poinPenilaian->map(fn($p, $i) => ['id_poin_aspek_penilaian' => $p->id_poin_aspek_penilaian, 'skor' => $i + 1])->toArray(),
            'catatan' => 'Baik sekali.'
        ];

        $this->post(route('penguji.penilaian.store', ['id_osce_stase' => $stase->id_osce_stase, 'id_enrollment_osce' => $enrollmentB->id_enrollment_osce]), $payload)
             ->assertRedirect(route('penguji.penilaian.edit', ['id_enrollment_osce' => $enrollmentA->id_enrollment_osce]));

        $this->assertDatabaseHas('nilai_osce', ['id_enrollment_osce' => $enrollmentB->id_enrollment_osce, 'nilai' => 1]);
    }

    #[Test]
    public function simpan_nilai_gagal_jika_skor_tidak_lengkap()
    {
        [$osce, $stase, $poinPenilaian] = $this->createOsceStructure(3);
        $enrollment = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);

        // Kirim hanya 1 dari 3 poin
        $this->post(route('penguji.penilaian.store', ['id_osce_stase' => $stase->id_osce_stase, 'id_enrollment_osce' => $enrollment->id_enrollment_osce]), [
            'nilai' => [['id_poin_aspek_penilaian' => $poinPenilaian[0]->id_poin_aspek_penilaian, 'skor' => 3]], 
        ])
             ->assertSessionHasErrors(['error']);
        
        $this->assertDatabaseCount('nilai_osce', 0);
    }

    #[Test]
    public function rotasi_mengambil_mahasiswa_berikutnya_yang_belum_dinilai()
    {
        [$osce, $stase, $poinPenilaian] = $this->createOsceStructure(1);
        $enrollmentA = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);
        $enrollmentB = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);

        // A sudah dinilai
        NilaiOsce::create(['id_enrollment_osce' => $enrollmentA->id_enrollment_osce, 'id_poin_aspek_penilaian' => $poinPenilaian[0]->id_poin_aspek_penilaian, 'nilai' => 1]);
        
        // Memastikan rotasi mengabaikan A dan redirect ke B
        $this->get(route('penguji.stase.rotasi', ['id_osce' => $osce->id_osce, 'id_osce_stase' => $stase->id_osce_stase]))
             ->assertRedirect(route('penguji.penilaian.edit', ['id_enrollment_osce' => $enrollmentB->id_enrollment_osce]));
    }

    #[Test]
    public function update_nilai_berhasil_menggunakan_post()
    {
        [$osce, $stase, $poinPenilaian] = $this->createOsceStructure(2);
        $enrollment = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);
        $nextEnrollment = EnrollmentOsce::create(['id_osce' => $osce->id_osce, 'id_mahasiswa' => Mahasiswa::factory()->create()->id_mahasiswa, 'id_osce_stase' => $stase->id_osce_stase]);
        
        // Nilai awal
        NilaiOsce::create(['id_enrollment_osce' => $enrollment->id_enrollment_osce, 'id_poin_aspek_penilaian' => $poinPenilaian[0]->id_poin_aspek_penilaian, 'nilai' => 5]);
        
        $payload = [
            'nilai' => $poinPenilaian->map(fn($p, $i) => ['id_poin_aspek_penilaian' => $p->id_poin_aspek_penilaian, 'skor' => 2 + $i])->toArray(),
            'catatan' => 'Catatan Revisi'
        ];

        $this->post(route('penguji.penilaian.store', ['id_osce_stase' => $stase->id_osce_stase, 'id_enrollment_osce' => $enrollment->id_enrollment_osce]), $payload)
             // Rotasi ke mahasiswa berikutnya setelah update
             ->assertRedirect(route('penguji.penilaian.edit', ['id_enrollment_osce' => $nextEnrollment->id_enrollment_osce]));

        $this->assertDatabaseHas('nilai_osce', ['id_poin_aspek_penilaian' => $poinPenilaian[0]->id_poin_aspek_penilaian, 'nilai' => 2]);
        $this->assertDatabaseHas('enrollment_osce', ['id_enrollment_osce' => $enrollment->id_enrollment_osce, 'catatan_penguji' => 'Catatan Revisi']);
    }
}