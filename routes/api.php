<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

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

});