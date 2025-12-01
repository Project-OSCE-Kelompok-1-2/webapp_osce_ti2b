<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\Penguji\ProfilController;
use App\Http\Controllers\Api\Penguji\AksiPenilaianApiController;

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

        // Profil Penguji
        Route::get('/penguji/profil', [ProfilController::class, 'show_profile'])
            ->name('api.penguji.account.show');
        
        Route::post('/penguji/profil/update', [ProfilController::class, 'update_account'])
            ->name('api.penguji.account.update');
        
        
        // Route::get('/penguji/nilai/{id_enrollment_osce}', 
        //     [AksiPenilaianApiController::class, 'showNilai']);

        Route::post('/penguji/penilaian/{id_enrollment_osce}', 
            [AksiPenilaianApiController::class, 'storePenilaian']);

        Route::get('/penguji/rotasi/{id_osce_stase}', 
            [AksiPenilaianApiController::class, 'rotasi']);

        Route::post('/penguji/selesai/{id_osce_stase}', 
            [AksiPenilaianApiController::class, 'selesai']);
    });

});