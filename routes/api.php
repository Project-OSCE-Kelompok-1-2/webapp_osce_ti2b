<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\penguji\EditNilaiController;

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
        
            // --- Penilaian (Tugas Najwa) ---
        // Tugas 1: GET Form Edit (Mengambil data rubrik & nilai)
        Route::get('/penilaian/{id_enrollment_osce}/edit', [EditNilaiController::class, 'edit'])->name('penilaian.edit');
    
        // Tugas 2: PUT Simpan Edit (Menyimpan nilai)
        Route::put('/penilaian/{id_enrollment_osce}', [EditNilaiController::class, 'update'])->name('penilaian.update');
        });

});