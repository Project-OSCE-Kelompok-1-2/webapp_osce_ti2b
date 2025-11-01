<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StaseController;

// Route halaman utama (Home)
Route::get('/', function () {
    return Inertia::render('Home');
});

// Route untuk halaman Stase
Route::get('/stase', [StaseController::class, 'index'])->name('stase.index');
