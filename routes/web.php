<?php

use Inertia\Inertia;
use App\Models\TahunAkademik;
use Illuminate\Support\Facades\Route;

// --- Auth & Admin Controllers ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\OsceController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\StaseController;
use App\Http\Controllers\Admin\PengujiController;
use App\Http\Controllers\Penguji\RekapController;
use App\Http\Controllers\Penguji\ProfilController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\KompetensiController;
use App\Http\Controllers\Admin\OsceJadwalController;

// --- PENGUJI CONTROLLERS ---
use App\Http\Controllers\Admin\RekapNilaiController;
use App\Http\Controllers\Penguji\DashboardController;
use App\Http\Controllers\Penguji\EditNilaiController;
use App\Http\Controllers\Penguji\ViewNilaiController;
use App\Http\Controllers\Admin\AspekPenilaianController;
use App\Http\Controllers\Admin\OsceEnrollmentController;
use App\Http\Controllers\Penguji\AksiPenilaianController;
use App\Http\Controllers\Mahasiswa\NilaiMahasiswaController;
use App\Http\Controllers\Penguji\HalamanPenilaianController;

// --- MAHASISWA CONTROLLERS ---
use App\Http\Controllers\Mahasiswa\JadwalMahasiswaController;
use App\Http\Controllers\Mahasiswa\ProfilMahasiswaController;
use App\Http\Controllers\Mahasiswa\DashboardMahasiswaController;
use App\Http\Controllers\Mahasiswa\ListNilaiMahasiswaController;
use App\Http\Controllers\Penguji\OsceController as PengujiOsceController;

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

// ===========================
// === RUTE UNTUK PENGUJI ===
// ===========================
Route::prefix('penguji')->middleware(['auth', 'role:penguji'])->name('penguji.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard'); // Tambahkan nama
    Route::get('/osce', [PengujiOsceController::class, 'index'])->name('osce.index');
    Route::get('/pengaturan-akun', [ProfilController::class, 'show_profile'])->name('account.show');
    Route::post('/pengaturan-akun', [ProfilController::class, 'update_account'])->name('account.update');

    // --- ALUR PENILAIAN LIVE ---
    Route::get('/osce/{id_osce}/stase/{id_osce_stase}', [HalamanPenilaianController::class, 'showAntrian'])->name('antrian');
    Route::get('/penilaian/{id_enrollment_osce}', [HalamanPenilaianController::class, 'showPenilaian'])->name('penilaian.show');
    Route::post('/penilaian/{id_enrollment_osce}', [AksiPenilaianController::class, 'store'])->name('penilaian.store');
    Route::get('/osce/{id_osce}/stase/{id_osce_stase}/rotasi', [AksiPenilaianController::class, 'rotasi'])->name('rotasi');
    Route::post('/osce/{id_osce}/stase/{id_osce_stase}/selesai', [AksiPenilaianController::class, 'selesai'])->name('penilaian.selesai');
    Route::get('/penilaian/{id_enrollment_osce}/nilai', [AksiPenilaianController::class, 'getNilai'])->name('penilaian.getNilai');

    // --- ALUR PASCA UJIAN / REKAP ---
    Route::get('/osce/{id_osce}/stase/{id_osce_stase}/rekap', [RekapController::class, 'rekap'])->name('rekap.list');
    Route::get('/osce/{id_osce}/stase/{id_osce_stase}/edit-nilai', [RekapController::class, 'editNilai'])->name('edit.list');
    Route::get('/penilaian/{id_enrollment_osce}/edit', [EditNilaiController::class, 'edit'])->name('penilaian.edit');
    Route::put('/penilaian/{id_enrollment_osce}', [EditNilaiController::class, 'update'])->name('penilaian.update');
    Route::get('/penilaian/{id_enrollment_osce}/view', ViewNilaiController::class)->name('penilaian.view');
});

// =========================
// === RUTE UNTUK ADMIN ===
// =========================
Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {

    // --- Dashboard & Akun ---
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/pengaturan-akun', [AdminController::class, 'show_profile'])->name('account.show');
    Route::post('/pengaturan-akun', [AdminController::class, 'update_account'])->name('account.update');

    // --- Master Data ---
    Route::resource('stase', StaseController::class);
    Route::resource('stase.aspek-penilaian', AspekPenilaianController::class)->except(['show'])->shallow();
    Route::resource('aspek-penilaian.kompetensi', KompetensiController::class)->except(['show'])->shallow();

    Route::resource('dosen', PengujiController::class)->except(['show']);
    Route::get('/mahasiswa/template', [MahasiswaController::class, 'template'])->name('mahasiswa.template');
    Route::resource('mahasiswa', MahasiswaController::class)->except(['show']);
    Route::post('/mahasiswa/import', [MahasiswaController::class, 'import'])->name('mahasiswa.import');

    // --- OSCE: Helper Routes (Letakkan SEBELUM route dinamis {osce}) ---
    // [PERBAIKAN] Nama route dibersihkan dari 'admin.' karena sudah ada di group prefix
    Route::post('/osce/check-availability', [OsceJadwalController::class, 'checkAvailability'])->name('osce.check-availability');
    Route::post('/osce/get-mahasiswa', [OsceJadwalController::class, 'getMahasiswa'])->name('osce.get-mahasiswa');
    
    // [PERBAIKAN] Menghapus '/admin' di URL karena sudah di dalam prefix('admin')
    Route::post('/osce/{id_osce}/get-session-detail', [OsceJadwalController::class, 'getSessionDetail'])->name('osce.get-session-detail');

    // --- Modul OSCE Main ---
    Route::get('/osce', [OsceController::class, 'index'])->name('osce.index');
    Route::post('/osce', [OsceController::class, 'store'])->name('osce.store');
    
    Route::get('/osce/create', function () {
        $tahunAkademik = TahunAkademik::orderBy('tahun', 'desc')->get()->map(fn($th) => [
            'value' => $th->id_tahun_akademik,
            'label' => $th->tahun . ' - ' . $th->semester,
        ]);
        return Inertia::render('Admin/TambahOsce', ['tahunAkademikOptions' => $tahunAkademik]);
    })->name('osce.create');

    Route::get('/osce/{osce}/edit', [OsceController::class, 'edit'])->name('osce.edit');
    Route::put('/osce/{osce}', [OsceController::class, 'update'])->name('osce.update');
    Route::delete('/osce/{osce}', [OsceController::class, 'destroy'])->name('osce.destroy');

    // --- OSCE Jadwal ---
    Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index'])->name('osce.jadwal.index');
    Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store'])->name('osce.jadwal.store');
    Route::get('/osce/{id_osce}/jadwal/create', [OsceJadwalController::class, 'create'])->name('osce.jadwal.create');
    Route::get('/osce/{id_osce}/jadwal/{sesi_id}/edit', [OsceJadwalController::class, 'edit'])->name('osce.jadwal.edit');
    Route::put('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'update'])->name('osce.jadwal.update');
    Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy'])->name('osce.jadwal.destroy');

    // --- OSCE Enrollment ---
    Route::prefix('osce/{osce_id}/jadwal/{jadwal_id}')->name('osce.enrollment.')->group(function () {
        Route::get('/enrollment', [OsceEnrollmentController::class, 'index'])->name('index');
        Route::post('/enrollment', [OsceEnrollmentController::class, 'sync'])->name('sync');
    });

    // --- Rekap Nilai ---
    Route::get('/rekap-nilai', [RekapNilaiController::class, 'index'])->name('rekap.index');
    Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi'])->name('rekap.sesi');
    Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase'])->name('rekap.mahasiswa');
    Route::get('/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}', [RekapNilaiController::class, 'detailNilaiMahasiswa'])->name('rekap.detail');
    Route::get('/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}/download', [RekapNilaiController::class, 'downloadPdf'])->name('rekap.download');
});

// ===========================
// == RUTE UNTUK MAHASISWA ===
// ===========================
Route::prefix('mahasiswa')->middleware(['auth', 'role:mahasiswa'])->name('mahasiswa.')->group(function () {

    // [PERBAIKAN] Nama route diperbaiki (menghapus 'mahasiswa.' di dalam group)
    
    Route::get('/dashboard', [DashboardMahasiswaController::class, 'index'])->name('dashboard'); // Hasil: mahasiswa.dashboard

    Route::get('/nilai', [ListNilaiMahasiswaController::class, 'index'])->name('nilai');
    Route::get('/nilai/{id}', [NilaiMahasiswaController::class, 'show'])->name('nilai.show');

    // Page Pengaturan Akun
    Route::get('/pengaturan-akun', [ProfilMahasiswaController::class, 'show_profile'])->name('profil.show'); // Hasil: mahasiswa.profil.show
    // Action Update Akun
    Route::post('/pengaturan-akun', [ProfilMahasiswaController::class, 'update_account'])->name('profil.update'); // Hasil: mahasiswa.profil.update

    Route::get('/jadwal', [JadwalMahasiswaController::class, 'show_jadwal'])->name('jadwal.show');
});