<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
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

Route::prefix('v1')->group(function () {
    Route::get('/login', function () {
        return redirect()->route('login');
    });

    // 2. Route API Asli (POST)
    Route::post('/login', [AuthController::class, 'login']);

    // Routes yang butuh Token (Protected)
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        // Cek user saat ini
        Route::get('/me', function (Request $request) {
            return $request->user();
        });

        Route::prefix('admin')->group(function () {

            // --- Admin Dashboard & Profile ---
            Route::get('/dashboard', [AdminController::class, 'dashboard']);

            // URL: /api/v1/admin/pengaturan-akun
            Route::get('/pengaturan-akun', [AdminController::class, 'show_profile']);
            Route::post('/pengaturan-akun', [AdminController::class, 'update_account']);

            // --- OSCE ---
            Route::apiResource('osce', OsceController::class);

            // --- STASE ---
            Route::apiResource('stase', StaseController::class);

            // --- OSCE Stase ---
            Route::get('/osce/{id_osce}/stase', [OsceStaseController::class, 'index']);
            Route::post('/osce/{id_osce}/stase', [OsceStaseController::class, 'store']);
            Route::put('/osce/{id_osce}/stase/{osce_stase}', [OsceStaseController::class, 'update']);
            Route::delete('/osce/{id_osce}/stase/{id_osce_stase}', [OsceStaseController::class, 'destroy']);

            // --- OSCE Jadwal ---
            Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index']);
            Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store']);
            Route::put('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'update']);
            Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy']);

            // --- OSCE Enrollment ---
            Route::get(
                'osce/{osce_id}/jadwal/{jadwal_id}/enrollment',
                [OsceEnrollmentController::class, 'index']
            );

            Route::post(
                'osce/{osce_id}/jadwal/{jadwal_id}/enrollment',
                [OsceEnrollmentController::class, 'sync']
            );

            // --- Penguji ---
            Route::apiResource('penguji', PengujiController::class);

            // --- Aspek penilaian (Nested: Stase -> Aspek) ---
            Route::apiResource('stase.aspek-penilaian', AspekPenilaianController::class);

            // --- Kompetensi (Nested: Aspek -> Kompetensi) ---
            Route::apiResource('aspek-penilaian.kompetensi', KompetensiController::class);

            // --- Rekap Nilai ---
            Route::get('/rekap-nilai', [RekapNilaiController::class, 'index']);
            Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi']);
            Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase']);

            // --- Mahasiswa ---
            Route::apiResource('mahasiswa', MahasiswaController::class);
            Route::post('/mahasiswa/import', [MahasiswaController::class, 'import']);
        });
    });
}); 
