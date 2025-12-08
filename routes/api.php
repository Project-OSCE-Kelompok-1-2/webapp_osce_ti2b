<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
// Admin Controllers
use App\Http\Controllers\Api\V1\Admin\OsceController;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Admin\StaseController;
use App\Http\Controllers\Api\V1\Admin\PengujiController;
use App\Http\Controllers\Api\V1\Admin\MahasiswaController;
use App\Http\Controllers\Api\V1\Admin\OsceStaseController;
use App\Http\Controllers\Api\V1\Admin\KompetensiController;
use App\Http\Controllers\Api\V1\Admin\OsceJadwalController;
use App\Http\Controllers\Api\V1\Admin\RekapNilaiController;
use App\Http\Controllers\Api\V1\Admin\AspekPenilaianController;
use App\Http\Controllers\Api\V1\Admin\OsceEnrollmentController;
// Other Controllers
use App\Http\Controllers\Api\V1\Penguji\ViewNilaiController;
use App\Http\Controllers\Api\V1\Penguji\ProfilController;
use App\Http\Controllers\Api\V1\Penguji\AksiPenilaianApiController;
use App\Http\Controllers\Api\V1\Penguji\ApiHalamanPenilaian;

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

        // =================================================================
        // GROUP 1: ADMIN ROUTES
        // Prefix: /api/v1/admin/...
        // Middleware: roleApi:admin
        // =================================================================
        Route::prefix('admin')->middleware('roleApi:admin')->group(function () {
            
            // --- Dashboard & Profile ---
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/pengaturan-akun', [AdminController::class, 'show_profile']);
            Route::post('/pengaturan-akun', [AdminController::class, 'update_account']);

            // --- Master Data ---
            Route::apiResource('osce', OsceController::class);
            Route::apiResource('stase', StaseController::class);
            Route::apiResource('penguji', PengujiController::class); // CRUD Data Penguji oleh Admin
            Route::apiResource('mahasiswa', MahasiswaController::class);
            Route::post('/mahasiswa/import', [MahasiswaController::class, 'import']);

            // --- OSCE Relation (Stase & Jadwal) ---
            Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index']);
            Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store']);
            Route::put('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'update']);
            Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy']);

            // --- OSCE Enrollment ---
            Route::get('osce/{osce_id}/jadwal/{jadwal_id}/enrollment', [OsceEnrollmentController::class, 'index']);
            Route::post('osce/{osce_id}/jadwal/{jadwal_id}/enrollment', [OsceEnrollmentController::class, 'sync']);

            // --- Komponen Penilaian ---
            Route::apiResource('stase.aspek-penilaian', AspekPenilaianController::class);
            Route::apiResource('aspek-penilaian.kompetensi', KompetensiController::class);

            // --- Rekap & View Nilai ---
            Route::get('/rekap-nilai', [RekapNilaiController::class, 'index']);
            Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi']);
            Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase']);
            
            // View Detail Nilai (Read Only)
            Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class);
        });

        // =================================================================
        // GROUP 2: PENGUJI ROUTES (EXAMINER)
        // Prefix: /api/v1/penguji/...
        // (Disarankan pakai middleware roleApi:penguji jika ada)
        // =================================================================
        Route::prefix('penguji')->group(function () {
            
            // Profil Penguji (User yang sedang login)
            Route::get('/profil', [ProfilController::class, 'show_profile'])->name('api.penguji.account.show');
            Route::post('/profil/update', [ProfilController::class, 'update_account'])->name('api.penguji.account.update');

            // Aksi Penilaian (Input Nilai, Rotasi, Selesai)
            Route::post('/penilaian/{id_enrollment_osce}', [AksiPenilaianApiController::class, 'storePenilaian']);
            Route::get('/rotasi/{id_osce_stase}', [AksiPenilaianApiController::class, 'rotasi']);
            Route::get('/selesai/{id_osce_stase}', [AksiPenilaianApiController::class, 'selesai']);
        });

        // =================================================================
        // GROUP 3: HALAMAN PENILAIAN / FRONTEND ROUTES
        // Prefix: /api/v1/...
        // =================================================================
        
        // Halaman Antrian/Dashboard Penguji saat masuk ruangan
        Route::get('/osce/{id_osce}/stase/{id_osce_stase}', [ApiHalamanPenilaian::class, 'getAntrian'])
            ->name('antrian');

        // Halaman Form Penilaian
        Route::get('/penilaian/{id_enrollment_osce}', [ApiHalamanPenilaian::class, 'getPenilaian'])
            ->name('penilaian.show');

    }); // End auth:sanctum
}); // End v1