<?php

use App\Http\Controllers\OsceController; 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StaseController;
use App\Http\Controllers\PengujiController;
use App\Http\Controllers\KompetensiController;
use App\Http\Controllers\AspekPenilaianController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\RekapNilaiController;
use App\Http\Controllers\OsceEnrollmentController;
use App\Http\Controllers\OsceStaseController;

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

    // ✅ Rute Modul OSCE (List & Create)
    Route::get('/osce', [OsceController::class, 'index'])->name('osce.index');
    Route::post('/osce', [OsceController::class, 'store'])->name('osce.store');

    Route::get('/osce/{id_osce}/stase', [OsceStaseController::class, 'index'])->name('osce.stase.index');
    Route::post('/osce/{id_osce}/stase', [OsceStaseController::class, 'store'])->name('osce.stase.store');
    
    // Menu Penguji (Dosen)
    Route::get('/dosen', [PengujiController::class, 'index'])->name('dosen.index');
    Route::post('/dosen', [PengujiController::class, 'store'])->name('dosen.store');

    // === MENU MAHASISWA (baru ditambahkan) ===
    Route::get('/mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::post('/mahasiswa', [MahasiswaController::class, 'store'])->name('mahasiswa.store');

    // Mahasiswa - Import dari Excel
    Route::post('/mahasiswa/import', [MahasiswaController::class, 'import']);

    // Rekap Nilai
    Route::get('/rekap-nilai', [RekapNilaiController::class, 'index']);
    Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi']);

    // Rekap Nilai Method Detail
    Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase']); 
    Route::get('/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}', [RekapNilaiController::class, 'detailNilaiMahasiswa']);
    // Rute enrollment yang salah (seperti di file Anda sebelumnya) telah dihapus dari sini
});


// ===================================================================
// === RUTE BARU: OSCE ENROLLMENT (Membutuhkan osce_id & jadwal_id) ===
// ===================================================================
// Ini adalah rute yang benar untuk OsceEnrollmentController
Route::middleware(['auth', 'role:admin'])->prefix('admin/osce/{osce_id}/jadwal/{jadwal_id}')->group(function () {
    
    // GET: /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment (Tugas 1)
    Route::get('/enrollment', [OsceEnrollmentController::class, 'index'])->name('admin.osce.enrollment.index');

    // POST: /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment (Tugas 2)
    Route::post('/enrollment', [OsceEnrollmentController::class, 'sync'])->name('admin.osce.enrollment.sync');
});

// Rute fallback atau untuk role lain bisa ditambahkan di sini
// Route::prefix('mahasiswa')->middleware(['auth', 'role:mahasiswa'])->name('mahasiswa.')->group(function() { ... });
// Route::prefix('penguji')->middleware(['auth', 'role:penguji'])->name('penguji.')->group(function() { ... });