<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ViewNilaiController;
use App\Http\Controllers\Api\V1\InputNilaiController; // <--- Pastikan import controller baru

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

        // INPUT NILAI (Tambahkan ini)
        // Kita gunakan POST. Sesuaikan nama controllernya nanti.
        Route::post('/penilaian', InputNilaiController::class); 
    });

});