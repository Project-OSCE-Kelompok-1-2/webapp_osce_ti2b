<?php

use App\Models\TahunAkademik;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\OsceController; 
use App\Http\Controllers\Admin\StaseController;
use Inertia\Inertia; // Pastikan Inertia di-import
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\OsceStaseController;
use App\Http\Controllers\Admin\PengujiController;
use App\Http\Controllers\Admin\KompetensiController;
use App\Http\Controllers\Admin\OsceJadwalController;
use App\Http\Controllers\Admin\RekapNilaiController;
use App\Http\Controllers\Admin\AspekPenilaianController;
use App\Http\Controllers\Admin\OsceEnrollmentController;
use App\Http\Controllers\Penguji\ProfilController;

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

Route::prefix('penguji')->middleware(['auth', 'role:penguji'])->name('penguji.')->group(function () {

    // --- Dashboard & Akun ---
    Route::get('/pengaturan-akun', [ProfilController::class, 'show_profile'])->name('account.show');
    Route::post('/pengaturan-akun', [ProfilController::class, 'update_account'])->name('account.update');
});

// =========================
// === RUTE UNTUK ADMIN ===
// =========================
Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {

    // --- Dashboard & Akun ---
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/pengaturan-akun', [AdminController::class, 'show_profile'])->name('account.show');
    Route::post('/pengaturan-akun', [AdminController::class, 'update_account'])->name('account.update');

    // --- Master Data (Stase & Pengguna) ---
    Route::resource('stase', StaseController::class);
    Route::resource('stase.aspek-penilaian', AspekPenilaianController::class)->except(['show'])->shallow();
    Route::resource('aspek-penilaian.kompetensi', KompetensiController::class)->except(['show'])->shallow();
    
    Route::resource('dosen', PengujiController::class)->except(['show']);
    Route::resource('mahasiswa', MahasiswaController::class)->except(['show']);
    Route::post('/mahasiswa/import', [MahasiswaController::class, 'import'])->name('mahasiswa.import'); // <-- Diberi nama

    
    // --- Modul OSCE ---
    Route::get('/osce', [OsceController::class, 'index'])->name('osce.index');
    Route::post('/osce', [OsceController::class, 'store'])->name('osce.store');

    Route::get('/osce/create', function () {
        // Ambil data dari database
        $tahunAkademik = TahunAkademik::orderBy('tahun', 'desc')->get()->map(fn ($th) => [
            'value' => $th->id_tahun_akademik,
            'label' => $th->tahun . ' - ' . $th->semester,
        ]);
        
        // Kirim data 'tahunAkademikOptions' sebagai props ke component React
        return Inertia::render('Admin/TambahOsce', [
            'tahunAkademikOptions' => $tahunAkademik
        ]); 
    })->name('osce.create');

    Route::get('/osce/{osce}/edit', [OsceController::class, 'edit'])->name('osce.edit');
    Route::put('/osce/{osce}', [OsceController::class, 'update'])->name('osce.update');
    Route::delete('/osce/{osce}', [OsceController::class, 'destroy'])->name('osce.destroy');


    // --- OSCE Stase (Nested di bawah OSCE) ---
    Route::get('/osce/{id_osce}/stase', [OsceStaseController::class, 'index'])->name('osce.stase.index');
    Route::post('/osce/{id_osce}/stase', [OsceStaseController::class, 'store'])->name('osce.stase.store');
    Route::get('/osce/{id_osce}/stase/create', [OsceStaseController::class, 'create'])->name('osce.stase.create');
    Route::get('/osce/{id_osce}/stase/{osce_stase}/edit', [OsceStaseController::class, 'edit'])->name('osce.stase.edit');
    Route::put('/osce/{id_osce}/stase/{osce_stase}', [OsceStaseController::class, 'update'])->name('osce.stase.update');
    Route::delete('/osce/{id_osce}/stase/{id_osce_stase}', [OsceStaseController::class, 'destroy'])->name('osce.stase.destroy');


    // --- OSCE Jadwal (Nested di bawah OSCE) ---
    Route::get('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'index'])->name('osce.jadwal.index');
    Route::post('/osce/{id_osce}/jadwal', [OsceJadwalController::class, 'store'])->name('osce.jadwal.store');
    Route::get('/osce/{id_osce}/jadwal/create', [OsceJadwalController::class, 'create'])->name('osce.jadwal.create');
    Route::get('/osce/{id_osce}/jadwal/{sesi_id}/edit', [OsceJadwalController::class, 'edit'])->name('osce.jadwal.edit');
    Route::put('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'update'])->name('osce.jadwal.update');
    Route::delete('/osce/{id_osce}/jadwal/{sesi_id}', [OsceJadwalController::class, 'destroy'])->name('osce.jadwal.destroy');

    
    // --- OSCE Enrollment (Nested di bawah Jadwal) ---
    // (Grup ini dipindahkan ke dalam grup admin utama)
    Route::prefix('osce/{osce_id}/jadwal/{jadwal_id}')->name('osce.enrollment.')->group(function () {
        Route::get('/enrollment', [OsceEnrollmentController::class, 'index'])->name('index');
        Route::post('/enrollment', [OsceEnrollmentController::class, 'sync'])->name('sync');
    });


    // --- Rekap Nilai ---
    Route::get('/rekap-nilai', [RekapNilaiController::class, 'index'])->name('rekap.index'); // <-- Diberi nama
    Route::get('/rekap-nilai/{id_osce}/sesi', [RekapNilaiController::class, 'listSesi'])->name('rekap.sesi'); // <-- Diberi nama
    Route::get('/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa', [RekapNilaiController::class, 'listMahasiswaPerStase'])->name('rekap.mahasiswa'); // <-- Diberi nama
    
    // V V V BLOK INI TIDAK DIUBAH SESUAI PERMINTAAN V V V
    Route::get('/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}', function () {
        $dummyData = [
            "mahasiswa" => [ "nama" => "Riko Aditya (Dummy)", "nim" => "123456", "id_mahasiswa" => 1 ],
            "osce" => [ "nama_osce" => "OSCE Radiologi 01-A (Dummy)" ],
            "nilai_per_stase" => [
                [
                    "nama_stase" => "Stase Bedah Umum",
                    "nama_penguji" => "Dr. Afkar",
                    "nilai_akhir_stase" => 22.25,
                    "aspek_penilaian" => [
                        [
                            "aspek" => "Anamnesis",
                            "kompetensi" => [
                                [ "kompetensi" => "Menyapa pasien", "skor" => 3, "bobot" => 10, "nilai" => 30 ],
                                [ "kompetensi" => "Keluhan utama", "skor" => 2, "bobot" => 10, "nilai" => 20 ]
                            ]
                        ],
                        [
                            "aspek" => "Pemeriksaan Fisik",
                            "kompetensi" => [
                                [ "kompetensi" => "Inspeksi", "skor" => 3, "bobot" => 10, "nilai" => 30 ],
                                [ "kompetensi" => "Palpasi", "skor" => 1, "bobot" => 9, "nilai" => 9 ]
                            ]
                        ]
                    ]
                ],
                [
                    "nama_stase" => "Stase Anak",
                    "nama_penguji" => "Dr. Pedri",
                    "nilai_akhir_stase" => 23.00,
                    "aspek_penilaian" => [
                        [
                            "aspek" => "Komunikasi",
                            "kompetensi" => [
                                [ "kompetensi" => "Bicara dengan ortu", "skor" => 3, "bobot" => 10, "nilai" => 30 ],
                                [ "kompetensi" => "Bicara dengan anak", "skor" => 3, "bobot" => 10, "nilai" => 30 ]
                            ]
                        ]
                    ]
                ]
            ],
            "nilai_total_osce" => 45.25
        ];

        return Inertia::render('Admin/RekapDetailPage', [
            'detailNilai' => $dummyData
        ]);
    })->name('rekap.detail'); // <-- Rute dummy diberi nama
});
// === AKHIR GRUP ADMIN ===


// Rute fallback atau untuk role lain bisa ditambahkan di sini
// Route::prefix('mahasiswa')->middleware(['auth', 'role:mahasiswa'])->name('mahasiswa.')->group(function() { ... });
// Route::prefix('penguji')->middleware(['auth', 'role:penguji'])->name('penguji.')->group(function() { ... });

Route::get('penguji/rekapmahasiswapage', function () {
    return Inertia::render('Penguji/RekapMahasiswaPage');
});