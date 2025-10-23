<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/admin/dashboard', function () {
    return Inertia::render("Admin/Dashboard");
});

Route::get('/admin/profil', [AdminController::class, 'show_profile']);

Route::put('/admin/profil', [AdminController::class, 'update_profile']);