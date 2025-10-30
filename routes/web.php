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

Route::get('/admin/profil', [AdminController::class, 'show_profile']) -> name('admin.profil.show');

Route::put('/admin/profil/update', [AdminController::class, 'update_profile']) -> name('admin.profil.update');

Route::put('/admin/password/update', [AdminController::class, 'update_password']) -> name('admin.password.update');