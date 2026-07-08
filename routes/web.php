<?php

use App\Http\Controllers\BoardGameController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource('posts', PostController::class)->except('index');

Route::get('/', [PostController::class, 'index']);

Route::get('/katalog', [BoardGameController::class, 'index'])->name('katalog');
Route::get('/katalog/{boardGame}', [BoardGameController::class, 'show'])->name('katalog.show');