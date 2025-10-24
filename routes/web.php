<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia("Home");
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

Route::get('/admin/tambahaspek', function () {
    return Inertia::render('Admin/Tambahaspek');
});