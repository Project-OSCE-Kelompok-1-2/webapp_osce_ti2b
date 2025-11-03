<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StaseController;
use App\Http\Controllers\AspekPenilaianController;

// ======================== HALAMAN UMUM ========================
Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/auth/login', function () {
    return Inertia::render("Auth/Login");
})->name('login');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
});

Route::get('/admin/kompetensi', function () {
    return Inertia::render('Admin/Kompetensi');
});

Route::get('/admin/kompetensi/form', function () {
    return Inertia::render('Admin/KompetensiForm');
});

Route::get('/admin/pengaturanakun', function () {
    return Inertia::render('Admin/PengaturanAkun');
});

// ======================== STASE & ASPEK PENILAIAN ========================
Route::prefix('admin')->group(function () {

    // ---------- STASE ----------
    Route::prefix('stase')->group(function () {
        Route::get('/', [StaseController::class, 'index'])->name('stase.index');
        Route::get('/form/{id?}', [StaseController::class, 'form'])->name('stase.form');
        Route::post('/', [StaseController::class, 'store'])->name('stase.store');
        Route::put('/{id}', [StaseController::class, 'update'])->name('stase.update');
        Route::delete('/{id}', [StaseController::class, 'destroy'])->name('stase.destroy');

        // ---------- ASPEK PENILAIAN ----------
        Route::prefix('{id_stase}/aspek')->group(function () {
            Route::get('/', [AspekPenilaianController::class, 'index'])->name('aspek.index');
            Route::get('/form/{id_aspek?}', [AspekPenilaianController::class, 'form'])->name('aspek.form');
            Route::post('/', [AspekPenilaianController::class, 'store'])->name('aspek.store');
            Route::put('/{id_aspek}', [AspekPenilaianController::class, 'update'])->name('aspek.update');
            Route::delete('/{id_aspek}', [AspekPenilaianController::class, 'destroy'])->name('aspek.destroy');
        });
    });
});
