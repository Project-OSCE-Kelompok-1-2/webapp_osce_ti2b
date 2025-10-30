<?php

use App\Http\Controllers\AspekPenilaianController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia("Home");
});

Route::middleware(["auth", "role:admin"])->group(function () {
    Route::get('/stase/{id}/aspek', [AspekPenilaianController::class, "get_aspek_penilaian"]);
});
