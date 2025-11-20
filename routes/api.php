<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OsceController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\StaseController;
use App\Http\Controllers\Api\V1\PengujiController;
use App\Http\Controllers\Api\V1\MahasiswaController;
use App\Http\Controllers\Api\V1\OsceStaseController;
use App\Http\Controllers\Api\V1\KompetensiController;
use App\Http\Controllers\Api\V1\OsceJadwalController;
use App\Http\Controllers\Api\V1\RekapNilaiController;
use App\Http\Controllers\Api\V1\AspekPenilaianController;
use App\Http\Controllers\Api\V1\OsceEnrollmentController;

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
    });

    // --- OSCE ---
    Route::apiResource('osce', OsceController::class)->except(['show']);

    // --- STASE ---
    Route::apiResource('stase', StaseController::class)->except(['show']);

    // --- OSCE Stase ---
    Route::get('/osce/{id_osce}/stase', [OsceStaseController::class, 'index'])->name('osce.stase.index');
    Route::post('/osce/{id_osce}/stase', [OsceStaseController::class, 'store'])->name('osce.stase.store');
    Route::get('/osce/{id_osce}/stase/create', [OsceStaseController::class, 'create'])->name('osce.stase.create');
    Route::get('/osce/{id_osce}/stase/{osce_stase}/edit', [OsceStaseController::class, 'edit'])->name('osce.stase.edit');
    Route::put('/osce/{id_osce}/stase/{osce_stase}', [OsceStaseController::class, 'update'])->name('osce.stase.update');
    Route::delete('/osce/{id_osce}/stase/{id_osce_stase}', [OsceStaseController::class, 'destroy'])->name('osce.stase.destroy');

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

    // --- Aspek penilaian ---
    Route::apiResource('stase.aspek-penilaian', AspekPenilaianController::class);

    // --- Rekap Nilai ---
    Route::get('/rekap-nilai', [RekapNilaiController::class, 'index']);
    Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi']);
    Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase']); // <-- Diberi nama

    // --- Admin ---
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/pengaturan-akun', [AdminController::class, 'show_profile']);
    Route::post('/admin/pengaturan-akun', [AdminController::class, 'update_account'])->middleware("auth:sanctum");

    // Kompetensi
    Route::resource('aspek-penilaian.kompetensi', KompetensiController::class);

    Route::apiResource('/mahasiswa', MahasiswaController::class);
    Route::post('/mahasiswa/import', [MahasiswaController::class, 'import']);

    // --- OSCE Jadwal (Nested di bawah OSCE) ---
    Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index']);
    Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store']);
    Route::get('/osce/{id_osce}/jadwal/create', [OsceJadwalController::class, 'create']);
    Route::get('/osce/{id_osce}/jadwal/{sesi_id}/edit', [OsceJadwalController::class, 'edit']);
    Route::put('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'update']);
    Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy']);
}); 
