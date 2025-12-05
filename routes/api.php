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
<<<<<<< HEAD
use App\Http\Controllers\Api\Penguji\OscePengujiController as PengujiOsceListController;
use App\Http\Controllers\Api\V1\Penguji\PenilaianController;
=======
>>>>>>> 5368c0e6a0e9d5f831dff8bd45bb7c5c230db158

Route::prefix('v1')->group(function () {
    // Route::get('/login', function () {
    //     return redirect()->route('login');
    // });

    // 2. Route API Asli (POST)
    Route::post('/login', [AuthController::class, 'login']);

    // Routes yang butuh Token (Protected)
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        // Cek user saat ini
        // Route::get('/me', function (Request $request) {
        //     return $request->user();
        // });

        Route::prefix('admin')->middleware('roleApi:admin')->group(function () {
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
        // List OSCE/Jadwal Penguji
        Route::get('/penguji/osce', [PengujiOsceListController::class, 'index']);

        // Profil Penguji
        Route::get('/penguji/profil', [ProfilController::class, 'show_profile'])
            ->name('api.penguji.account.show');
        
        Route::post('/penguji/profil/update', [ProfilController::class, 'update_account'])
            ->name('api.penguji.account.update');

            // IMPORT MAHASISWA VIA EXCEL
            Route::post('/admin/mahasiswa/import', [MahasiswaController::class, 'import']);

            // VIEW NILAI (Sudah ada)
            Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class);

            // Profil Penguji
            Route::get('/penguji/profil', [ProfilController::class, 'show_profile'])
                ->name('api.penguji.account.show');

            Route::post('/penguji/profil/update', [ProfilController::class, 'update_account'])
                ->name('api.penguji.account.update');
        }); // <-- Menutup group auth:sanctum

        // Halaman Penilaian [Penguji]
        Route::get('/osce/{id_osce}/stase/{id_osce_stase}', [ApiHalamanPenilaian::class, 'getAntrian'])
            ->name('antrian');

        Route::get('/penilaian/{id_enrollment_osce}', [ApiHalamanPenilaian::class, 'getPenilaian'])
            ->name('penilaian.show');
    });
}); 
