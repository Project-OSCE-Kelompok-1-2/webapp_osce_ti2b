<?php

use App\Http\Controllers\StaseController;
use App\Http\Controllers\AspekPenilaianController;

Route::prefix('stase')->group(function () {
    Route::get('/', [StaseController::class, 'index'])->name('stase.index');
    Route::get('/form/{id?}', [StaseController::class, 'form'])->name('stase.form');
    Route::post('/', [StaseController::class, 'store'])->name('stase.store');
    Route::put('/{id}', [StaseController::class, 'update'])->name('stase.update');
    Route::delete('/{id}', [StaseController::class, 'destroy'])->name('stase.destroy');

    Route::prefix('{id_stase}/aspek')->group(function () {
        Route::get('/', [AspekPenilaianController::class, 'index'])->name('aspek.index');
        Route::get('/form/{id_aspek?}', [AspekPenilaianController::class, 'form'])->name('aspek.form');
        Route::post('/', [AspekPenilaianController::class, 'store'])->name('aspek.store');
        Route::put('/{id_aspek}', [AspekPenilaianController::class, 'update'])->name('aspek.update');
        Route::delete('/{id_aspek}', [AspekPenilaianController::class, 'destroy'])->name('aspek.destroy');
    });
});
