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
   
Route::get('/admin/kompetensi', function () {
    return Inertia::render('Admin/Kompetensi');
});

Route::get('/admin/kompetensi/form', function () {
    return Inertia::render('Admin/KompetensiForm');
});

Route::get('/admin/pengaturanakun', function () {
    return Inertia::render('Admin/PengaturanAkun');
});

Route::get('/admin/menustase', function () {
    return Inertia::render('Admin/MenuStase');
});

Route::get('/admin/tambahstase', function () {
    return Inertia::render('Admin/TambahStase');
});

Route::get('/admin/aspekpenilaian', function () {
    return Inertia::render('Admin/Aspekpenilaian');
});

Route::get('/admin/tambahaspek', function () {
    return Inertia::render('Admin/AddAspekForm');
});


