<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AspekPenilaianController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StaseController;
use App\Http\Controllers\KompetensiController; 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Halaman Awal -> Redirect ke Login
Route::get('/', function () {
    return redirect()->route('login');
});

// === RUTE AUTENTIKASI ===
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'show_login'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');


// === RUTE UNTUK ADMIN ===
Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {

    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Pengaturan Akun
    Route::get('/pengaturan-akun', [AdminController::class, 'show_profile'])->name('account.show');
    Route::post('/pengaturan-akun', [AdminController::class, 'update_account'])->name('account.update');

    // Menu Stase (CRUD)
    Route::resource('stase', StaseController::class);

    // Menu Aspek Penilaian (Nested di dalam Stase)
    Route::resource('stase.aspek-penilaian', AspekPenilaianController::class)->except(['show'])->shallow();

    // Menu Kompetensi / Poin Penilaian (Nested di dalam Aspek)
    Route::resource('aspek-penilaian.kompetensi', KompetensiController::class)->except(['show'])->shallow();

});

// Rute fallback atau untuk role lain bisa ditambahkan di sini
// Route::prefix('mahasiswa')->middleware(['auth', 'role:mahasiswa'])->name('mahasiswa.')->group(function() { ... });
// Route::prefix('penguji')->middleware(['auth', 'role:penguji'])->name('penguji.')->group(function() { ... });
