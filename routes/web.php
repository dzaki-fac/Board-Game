<?php

use App\Http\Controllers\BoardGameController;
use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\AuthenticatedSessionController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PostController::class, 'index']);

Route::redirect('/admin', '/admin/login');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware('auth:admin')->group(function () {
        Route::resource('games', BoardGameController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])->parameters(['games' => 'boardGame']);

        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

        Route::get('accounts', [AdminAccountController::class, 'index'])->name('accounts.index');
        Route::post('accounts', [AdminAccountController::class, 'store'])->name('accounts.store')->middleware('superadmin');
        Route::put('accounts/{admin}', [AdminAccountController::class, 'update'])->name('accounts.update')->middleware('superadmin');
        Route::delete('accounts/{admin}', [AdminAccountController::class, 'destroy'])->name('accounts.destroy')->middleware('superadmin');

        Route::any('{any?}', fn () => abort(404))->where('any', '.*');
    });
});
