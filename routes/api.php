<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\penguji\EditNilaiController;
use App\Http\Controllers\Api\V1\ViewNilaiController;
use App\Http\Controllers\Api\V1\InputNilaiController; // <--- Pastikan import controller baru
use App\Http\Controllers\Api\Penguji\ProfilController;

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
        
            // --- Penilaian (Tugas Najwa) ---
        // Tugas 1: GET Form Edit (Mengambil data rubrik & nilai)
        Route::get('/penilaian/{id_enrollment_osce}/edit', [EditNilaiController::class, 'edit'])->name('penilaian.edit');
    
        // Tugas 2: PUT Simpan Edit (Menyimpan nilai)
        Route::put('/penilaian/{id_enrollment_osce}', [EditNilaiController::class, 'update'])->name('penilaian.update');
        });

        // VIEW NILAI (Sudah ada)
        Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class);


        // Profil Penguji
        Route::get('/penguji/profil', [ProfilController::class, 'show_profile'])
            ->name('api.penguji.account.show');
        
        Route::post('/penguji/profil/update', [ProfilController::class, 'update_account'])
            ->name('api.penguji.account.update');
    });