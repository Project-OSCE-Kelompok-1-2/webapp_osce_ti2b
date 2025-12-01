<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ViewNilaiController;
use App\Http\Controllers\Api\V1\InputNilaiController;
use App\Http\Controllers\Api\Penguji\ProfilController;
use App\Http\Controllers\Api\V1\ApiHalamanPenilaian;

Route::prefix('v1')->group(function () {
    Route::get('/login', function () {
        return redirect()->route('login');
    });

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/me', function (Request $request) {
            return $request->user();
        });

        // VIEW NILAI (Sudah ada)
        Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class);


        // Profil Penguji
        Route::get('/penguji/profil', [ProfilController::class, 'show_profile'])
            ->name('api.penguji.account.show');

        Route::post('/penguji/profil/update', [ProfilController::class, 'update_account'])
            ->name('api.penguji.account.update');

        // Halaman Penilaian [Penguji]
        Route::get('/osce/{id_osce}/stase/{id_osce_stase}', [ApiHalamanPenilaian::class, 'getAntrian'])
            ->name('antrian');

        Route::get('/penilaian/{id_enrollment_osce}', [ApiHalamanPenilaian::class, 'getPenilaian'])
            ->name('penilaian.show');
    });
});
