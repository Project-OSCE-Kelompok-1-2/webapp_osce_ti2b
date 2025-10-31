<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render("Home");
});

Route::get('/login', [AuthController::class, "show_login"]);

Route::post('/login', [AuthController::class, "login"]);

Route::post('/logout', [AuthController::class, "logout"]);
