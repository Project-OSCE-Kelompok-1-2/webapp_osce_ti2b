<?php

namespace Tests\Feature;

use App\Models\AspekPenilaian;
use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\Osce;
use App\Models\OsceStase;
use App\Models\Penguji;
use App\Models\PoinAspekPenilaian;
use App\Models\Stase;
use App\Models\Pengguna;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;

class AksiPenilaianTest extends TestCase
{
    use RefreshDatabase;

    protected $pengujiUser;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup user penguji untuk autentikasi
        $this->pengujiUser = Pengguna::factory()->create(['jenis_role' => 'penguji']); 
    }

    #[Test]
    // Test Case 1: simpan_nilai_berhasil_dengan_skor_0_sampai_4
    public function simpan_nilai_berhasil_dengan_skor_0_sampai_4()
    {
        // 1. Setup data
        $osce = Osce::factory()->create(['tanggal_selesai' => Carbon::now()->addDay()]);
        $stase = Stase::factory()->create();
        $penguji = Penguji::factory()->create(['id_pengguna' => $this->pengujiUser->id_pengguna]);
        
        $osceStase = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce,
            'id_stase' => $stase->id_stase,
            'id_penguji' => $penguji->id_penguji,
            'tanggal' => Carbon::now(),
        ]);

        $enrollments = EnrollmentOsce::factory()->count(2)->create(['id_osce' => $osce->id_osce]);
        $enrollmentSaatIni = $enrollments->first();

        $aspek = AspekPenilaian::factory()->create(['id_stase' => $stase->id_stase]);
        // Membuat poin penilaian dummy
        $poin1 = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);
        $poin2 = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);

        $payload = [
            'nilai' => [
                ['id_poin_aspek_penilaian' => $poin1->id_poin_aspek_penilaian, 'skor' => 4], // Skor Max
                ['id_poin_aspek_penilaian' => $poin2->id_poin_aspek_penilaian, 'skor' => 0], // Skor Min (Sesuai ketentuan min:0)
            ],
            'catatan' => 'Baik sekali.',
        ];

        // 2. Aksi: Simpan nilai. (Menggunakan URI yang sudah diperbaiki: /penguji/stase/...)
        $response = $this->actingAs($this->pengujiUser)->post(
            "/penguji/stase/{$osceStase->id_osce_stase}/penilaian/{$enrollmentSaatIni->id_enrollment_osce}", 
            $payload
        );

        // 3. Assertions
        $response->assertStatus(302);
        // Memastikan nilai telah tersimpan
        $this->assertDatabaseHas('nilai_osce', [
            'id_enrollment_osce' => $enrollmentSaatIni->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $poin1->id_poin_aspek_penilaian,
            'nilai' => 4, // Verifikasi nilai skor 4
        ]);
        $this->assertDatabaseHas('nilai_osce', [
            'id_enrollment_osce' => $enrollmentSaatIni->id_enrollment_osce,
            'id_poin_aspek_penilaian' => $poin2->id_poin_aspek_penilaian,
            'nilai' => 0, // Verifikasi nilai skor 0
        ]);
    }

    #[Test]
    // Test Case 2: simpan_nilai_gagal_jika_array_nilai_kosong (Sesuai dengan 'gagal jika skor tidak lengkap')
    public function simpan_nilai_gagal_jika_array_nilai_kosong()
    {
        // 1. Setup data
        $osce = Osce::factory()->create(['tanggal_selesai' => Carbon::now()->addDay()]);
        $stase = Stase::factory()->create();
        $penguji = Penguji::factory()->create(['id_pengguna' => $this->pengujiUser->id_pengguna]);
        
        $osceStase = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce,
            'id_stase' => $stase->id_stase,
            'id_penguji' => $penguji->id_penguji,
            'tanggal' => Carbon::now(),
        ]);

        $enrollment = EnrollmentOsce::factory()->create(['id_osce' => $osce->id_osce]);
        
        // Payload yang akan gagal pada 'required|array|min:1' (Array kosong dianggap tidak lengkap)
        $payload_kosong = [ 
            'nilai' => [], 
            'catatan' => 'Catatan.',
        ];

        // 2. Aksi: Simpan nilai.
        $response = $this->actingAs($this->pengujiUser)->post(
            "/penguji/stase/{$osceStase->id_osce_stase}/penilaian/{$enrollment->id_enrollment_osce}", 
            $payload_kosong
        );

        // 3. Assertions
        $response->assertSessionHasErrors(['nilai']); 
        $response->assertStatus(302);
        // Memastikan tidak ada nilai yang tersimpan
        $this->assertDatabaseMissing('nilai_osce', [
            'id_enrollment_osce' => $enrollment->id_enrollment_osce,
        ]);
    }

    #[Test]
    // Test Case 3: simpan_nilai_gagal_jika_skor_di_luar_rentang_0_4 (Gagal karena min/max)
    public function simpan_nilai_gagal_jika_skor_di_luar_rentang_0_4()
    {
        // 1. Setup data
        $osce = Osce::factory()->create(['tanggal_selesai' => Carbon::now()->addDay()]);
        $stase = Stase::factory()->create();
        $penguji = Penguji::factory()->create(['id_pengguna' => $this->pengujiUser->id_pengguna]);
        
        $osceStase = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce,
            'id_stase' => $stase->id_stase,
            'id_penguji' => $penguji->id_penguji,
            'tanggal' => Carbon::now(),
        ]);

        $enrollment = EnrollmentOsce::factory()->create(['id_osce' => $osce->id_osce]);
        $aspek = AspekPenilaian::factory()->create(['id_stase' => $stase->id_stase]);
        $poin_valid = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);
        $poin_fail = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);
        
        // Payload yang mengandung skor > 4 (gagal pada max:4)
        $payload_fail = [ 
            'nilai' => [
                ['id_poin_aspek_penilaian' => $poin_valid->id_poin_aspek_penilaian, 'skor' => 4],
                ['id_poin_aspek_penilaian' => $poin_fail->id_poin_aspek_penilaian, 'skor' => 5], // Gagal!
            ],
            'catatan' => 'Skor terlalu tinggi.',
        ];

        // 2. Aksi: Simpan nilai.
        $response = $this->actingAs($this->pengujiUser)->post(
            "/penguji/stase/{$osceStase->id_osce_stase}/penilaian/{$enrollment->id_enrollment_osce}", 
            $payload_fail
        );

        // 3. Assertions
        // Memastikan error spesifik pada field 'nilai.*.skor' yang gagal.
        $response->assertSessionHasErrors('nilai.*.skor'); 
        $response->assertStatus(302);
    }
    
    #[Test]
    // Test Case 5: selesai_merespons_inactive_jika_semua_stase_di_sesi_kosong
    public function selesai_merespons_inactive_jika_semua_stase_di_sesi_kosong()
    {
        // 1. Setup Data: Buat OSce dengan 2 Stase di sesi yang sama (hari yang sama)
        $tanggalSesi = Carbon::today();
        $osce = Osce::factory()->create(['tanggal_mulai' => $tanggalSesi, 'tanggal_selesai' => $tanggalSesi->addDay()]);
        $penguji = Penguji::factory()->create(['id_pengguna' => $this->pengujiUser->id_pengguna]);

        $stase1 = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce, 'id_penguji' => $penguji->id_penguji, 'tanggal' => $tanggalSesi
        ]);
        $stase2 = OsceStase::factory()->create([
            'id_osce' => $osce->id_osce, 'id_penguji' => $penguji->id_penguji, 'tanggal' => $tanggalSesi
        ]);

        // Buat 1 Enrollment OSCE
        $enrollment = EnrollmentOsce::factory()->create(['id_osce' => $osce->id_osce]);

        // Skenario: Kedua stase (stase1 & stase2) harus dianggap 'kosong'
        // Menandai mahasiswa sudah dinilai di KEDUA stase
        $this->markStudentAsScored($enrollment, $stase1);
        $this->markStudentAsScored($enrollment, $stase2);
        
        // 2. Aksi: Panggil endpoint selesai untuk stase 1 (Menggunakan URI yang sudah diperbaiki: /penguji/osce/...)
        $response = $this->actingAs($this->pengujiUser)->post(
            "/penguji/osce/{$osce->id_osce}/stase/{$stase1->id_osce_stase}/selesai"
        );

        // 3. Assertions
        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'inactive',
            'message' => 'Sesi penilaian untuk tanggal ini telah selesai.'
        ]);
    }

    // Test Case 6: selesai_merespons_active_jika_ada_stase_lain_yang belum kosong (DINONAKTIFKAN SESUAI PERMINTAAN SEBELUMNYA)
    public function selesai_merespons_active_jika_ada_stase_lain_yang_belum_kosong()
    {
        // Test ini dinonaktifkan
    }
    
    // =================================================================================
    // HELPER FUNCTIONS 
    // =================================================================================

    protected function markStudentAsScored(EnrollmentOsce $enrollment, OsceStase $osceStase)
    {
        // Helper untuk menandai bahwa Mahasiswa sudah dinilai di Stase tertentu
        $staseModel = Stase::find($osceStase->id_stase);
        
        $aspek = AspekPenilaian::factory()->create(['id_stase' => $staseModel->id_stase]);
        $poin = PoinAspekPenilaian::factory()->create(['id_aspek_penilaian' => $aspek->id_aspek_penilaian]);

        NilaiOsce::updateOrCreate(
            [
                'id_enrollment_osce' => $enrollment->id_enrollment_osce,
                'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
            ],
            ['nilai' => 1] 
        );
    }
}