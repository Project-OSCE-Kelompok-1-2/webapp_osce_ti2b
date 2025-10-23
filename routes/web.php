<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/admin/dashboard', function () {
    return Inertia::render("Admin/Dashboard");
});

Route::get('/admin/profil', function () {
    return Inertia::render("Admin/Profil");
});

Route::put('/admin/profil', function () {
    return Inertia::render("Admin/Profil");
});