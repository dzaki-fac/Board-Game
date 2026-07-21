<?php

use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AuthenticatedSessionController;
use App\Http\Controllers\BoardGameController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PermohonanController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

// Route::get('/', [PermohonanController::class, 'create']);


Route::get('/', [BoardGameController::class, 'katalog'])->name('katalog');
Route::get('/katalog', [BoardGameController::class, 'katalog'])->name('katalog');
Route::get('/katalog/{boardGame}', [BoardGameController::class, 'detail'])->name('katalog.show');
Route::post('/katalog/{boardGame}/reviews', [ReviewController::class, 'store'])->name('katalog.reviews.store');

Route::prefix('admin')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
        Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('admin.login.store');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::get('/', [BoardGameController::class, 'index'])->name('admin.dashboard');
        
        Route::resource('games', BoardGameController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])->parameters(['games' => 'boardGame']);

        Route::get('loans', [LoanController::class, 'index'])->name('loans.index');
        Route::patch('loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
        Route::get('loans/{loan}', [LoanController::class, 'show'])->name('loans.show');

        Route::get('returns', [ReturnController::class, 'create'])->name('returns.create');
        Route::post('returns', [ReturnController::class, 'store'])->name('returns.store');

        Route::get('history', [HistoryController::class, 'index'])->name('history.index');

        Route::get('permohonan', [PermohonanController::class, 'permohonan'])->name('admin.permohonan.index');
        Route::patch('permohonan/{permohonan}/approve', [PermohonanController::class, 'approve'])->name('admin.permohonan.approve');
        Route::patch('permohonan/{permohonan}/reject', [PermohonanController::class, 'reject'])->name('admin.permohonan.reject');

        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

        Route::get('rules', [HomeController::class, 'rules'])->name('admin.rules');

        Route::get('reviews', [AdminReviewController::class, 'index'])->name('admin.reviews.index');
        Route::delete('reviews/{boardGameReview}', [AdminReviewController::class, 'destroy'])->name('admin.reviews.destroy');

        Route::get('accounts', [AdminAccountController::class, 'index'])->name('admin.accounts.index');
        Route::post('accounts', [AdminAccountController::class, 'store'])->name('admin.accounts.store')->middleware('superadmin');
        Route::put('accounts/{admin}', [AdminAccountController::class, 'update'])->name('admin.accounts.update');
        Route::delete('accounts/{admin}', [AdminAccountController::class, 'destroy'])->name('admin.accounts.destroy')->middleware('superadmin');

        Route::any('{any?}', fn () => abort(404))->where('any', '.*');
    });
});

Route::get('/peminjaman/create', [PermohonanController::class, 'create'])->name('peminjaman.create');
Route::post('/peminjaman', [PermohonanController::class, 'store'])->name('peminjaman.store');
Route::get('/peminjaman/gagal', [PermohonanController::class, 'konfirmasiGagal'])->name('peminjaman.gagal');
Route::get('/peminjaman/{permohonan}/konfirmasi', [PermohonanController::class, 'konfirmasi'])->name('peminjaman.konfirmasi');
