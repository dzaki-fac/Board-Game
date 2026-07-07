<?php

use App\Http\Controllers\LoanController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReturnController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::prefix('admin')->group(function () {
    Route::get('/', [PostController::class, 'index']);

    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    Route::patch('/loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');

    Route::get('/returns', [ReturnController::class, 'create'])->name('returns.create');
    Route::post('/returns', [ReturnController::class, 'store'])->name('returns.store');

    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');

    Route::resource('posts', PostController::class)->except('index');
});
