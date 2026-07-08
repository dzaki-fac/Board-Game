<?php

use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource('posts', PostController::class)->except('index');

Route::get('/', [PostController::class, 'index']);

Route::get('/peminjaman/create', [PeminjamanController::class, 'create'])->name('peminjaman.create');
Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
Route::get('/permohonan', [PeminjamanController::class, 'permohonan'])->name('permohonan.index');
Route::patch('/permohonan/{peminjaman}/setujui', [PeminjamanController::class, 'setujui'])->name('permohonan.setujui');
Route::patch('/permohonan/{peminjaman}/tolak', [PeminjamanController::class, 'tolak'])->name('permohonan.tolak');