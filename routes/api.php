<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

// Admin Controllers
use App\Http\Controllers\Api\V1\Admin\OsceController;
use App\Http\Controllers\Api\V1\InputNilaiController;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Admin\StaseController;
use App\Http\Controllers\Api\V1\Admin\PengujiController;
use App\Http\Controllers\Api\V1\Penguji\ProfilController;
use App\Http\Controllers\Api\V1\Admin\MahasiswaController;
use App\Http\Controllers\Api\V1\Admin\OsceStaseController;
use App\Http\Controllers\Api\V1\Admin\KompetensiController;
use App\Http\Controllers\Api\V1\Admin\OsceJadwalController;
use App\Http\Controllers\Api\V1\Admin\RekapNilaiController;

// Penguji Controllers
use App\Http\Controllers\Api\V1\Penguji\ApiHalamanPenilaian;
use App\Http\Controllers\Api\V1\Penguji\EditNilaiController;
use App\Http\Controllers\Api\V1\Penguji\ViewNilaiController;
use App\Http\Controllers\Api\V1\Admin\AspekPenilaianController;
use App\Http\Controllers\Api\V1\Admin\OsceEnrollmentController;
use App\Http\Controllers\Api\V1\Mahasiswa\NilaiMahasiswaController;
use App\Http\Controllers\Api\V1\Penguji\AksiPenilaianApiController;

// Mahasiswa Controllers
use App\Http\Controllers\Api\V1\Mahasiswa\JadwalMahasiswaController;
use App\Http\Controllers\Api\V1\Mahasiswa\ProfilMahasiswaController;
use App\Http\Controllers\Api\v1\Mahasiswa\DashboardMahasiswaController;
use App\Http\Controllers\Api\V1\Mahasiswa\ListNilaiMahasiswaController;

Route::prefix('v1')->group(function () {

    // --- Authentication ---
    Route::get('/login', function () {
        return response()->json(['message' => 'Unauthorized'], 401);
    })->name('login');

    Route::post('/login', [AuthController::class, 'login']);

    // --- Protected Routes ---
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/me', function (Request $request) {
            return $request->user();
        });

        Route::get('/penilaian/{id_enrollment_osce}/edit', [EditNilaiController::class, 'edit'])->name('penilaian.edit');
        Route::put('/penilaian/{id_enrollment_osce}', [EditNilaiController::class, 'update'])->name('penilaian.update');

        // =================================================================
        // GROUP 1: ADMIN ROUTES
        // =================================================================
        Route::prefix('admin')->middleware('roleApi:admin')->group(function () {

            // --- Dashboard & Profile ---
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/pengaturan-akun', [AdminController::class, 'show_profile']);
            Route::post('/pengaturan-akun', [AdminController::class, 'update_account']);

            // --- Master Data ---
            Route::apiResource('osce', OsceController::class);
            Route::apiResource('stase', StaseController::class);
            Route::apiResource('penguji', PengujiController::class);
            Route::apiResource('mahasiswa', MahasiswaController::class);
            Route::post('/mahasiswa/import', [MahasiswaController::class, 'import']);

            // --- OSCE Relation (Stase & Jadwal) ---
            Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index']);
            Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store']);
            Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy']);

            // --- Komponen Penilaian ---
            Route::apiResource('stase.aspek-penilaian', AspekPenilaianController::class);
            Route::apiResource('aspek-penilaian.kompetensi', KompetensiController::class);

            // --- Rekap & View Nilai ---
            Route::get('/rekap-nilai', [RekapNilaiController::class, 'index']);
            Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi']);
            Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase']);

        });

        // =================================================================
        // GROUP 2: PENGUJI ROUTES 
        // =================================================================
        Route::prefix('penguji')->middleware("roleApi:penguji")->group(function () {

            // Profil Penguji
            Route::get('/profil', [ProfilController::class, 'show_profile'])->name('api.penguji.account.show');
            Route::post('/profil/update', [ProfilController::class, 'update_account'])->name('api.penguji.account.update');

            // Aksi Penilaian
            Route::post('/penilaian/{id_enrollment_osce}', [AksiPenilaianApiController::class, 'storePenilaian']);
            Route::get('/rotasi/{id_osce_stase}', [AksiPenilaianApiController::class, 'rotasi']);
            Route::get('/selesai/{id_osce_stase}', [AksiPenilaianApiController::class, 'selesai']);

            Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class);
        });

        // =================================================================
        // GROUP 3: HALAMAN PENILAIAN / FRONTEND ROUTES
        // =================================================================

        Route::get('/osce/{id_osce}/stase/{id_osce_stase}', [ApiHalamanPenilaian::class, 'getAntrian'])
            ->name('antrian');

        Route::get('/penilaian/{id_enrollment_osce}', [ApiHalamanPenilaian::class, 'getPenilaian'])
            ->name('penilaian.show');

        // =================================================================
        // GROUP 4: MAHASISWA ROUTES 
        // =================================================================
        Route::prefix('mahasiswa')->middleware("roleApi:mahasiswa")->name('mahasiswa.')->group(function () {

            // Dashboard
            Route::get('/dashboard', [DashboardMahasiswaController::class, 'index'])->name('dashboard');

            // Nilai
            Route::get('/nilai', [ListNilaiMahasiswaController::class, 'index'])->name('nilai');
            Route::get('/nilai/{id}', [NilaiMahasiswaController::class, 'show'])->name('nilai.show');

            // Jadwal
            Route::get('/jadwal', [JadwalMahasiswaController::class, 'show_jadwal'])->name('jadwal.show');

            // Pengaturan Akun
            Route::get('/pengaturan-akun', [ProfilMahasiswaController::class, 'show_profile'])->name('profil.show');
            Route::post('/pengaturan-akun', [ProfilMahasiswaController::class, 'update_account'])->name('profil.update');
        });
    }); 
}); 