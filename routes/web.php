<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/auth/login', function () {
    return Inertia::render("Auth/Login");
})->name('login');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
});
   
Route::get('/admin/menukompetensi', function () {
    return Inertia::render('Admin/MenuKompetensi');
});

Route::get('/admin/menukompetensi/tambahkompetensi', function () {
    return Inertia::render('Admin/TambahKompetensi');
});

Route::get('/admin/pengaturanakun', function () {
    return Inertia::render('Admin/PengaturanAkun');
});

Route::get('/admin/menustase', function () {
    return Inertia::render('Admin/MenuStase');
});

Route::get('/admin/menustase/tambahstase', function () {
    return Inertia::render('Admin/TambahStase');
});

Route::get('/admin/menuaspekpenilaian', function () {
    return Inertia::render('Admin/MenuAspekPenilaian');
});

Route::get('/admin/menuaspekpenilaian/tambahaspekpenilaian', function () {
    return Inertia::render('Admin/TambahAspekPenilaian');
});


