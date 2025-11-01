<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// 🏠 Halaman Home (public)
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');


// 🔐 AUTHENTICATION
Route::middleware('guest')->group(function () {
    // Halaman Login
    Route::get('/login', [AuthController::class, 'show_login'])
        ->name('login');

    // Proses Login
    Route::post('/login', [AuthController::class, 'login'])
        ->name('login.process');
});

// Logout tetap boleh diakses setelah login
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


// 🧭 ADMIN AREA (wajib login)
Route::middleware(['auth'])->group(function () {

    // Dashboard admin
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Halaman profil
    Route::get('/admin/pengaturanakun', [AdminController::class, 'show_profile'])
        ->name('admin.profile.show');

    // 2. Rute BARU untuk SUBMIT form (Gantikan 2 rute lama)
    Route::post('/admin/profil/update', [AdminController::class, 'update_account'])
        ->name('admin.account.update');
});
