<?php

use App\Http\Controllers\OsceStaseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StaseController;

// Route halaman utama (Home)
Route::get('/', function () {
    return Inertia::render('Home');
});

// Route untuk halaman Stase
Route::get('/stase', [StaseController::class, 'get_all_stase']);
