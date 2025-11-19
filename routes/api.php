<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OsceController;
use App\Http\Controllers\Api\V1\StaseController;
use App\Http\Controllers\Api\V1\PengujiController;
use App\Http\Controllers\Api\V1\OsceStaseController;
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
});
