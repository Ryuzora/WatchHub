<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)->group(function(){
    Route::get('users', [AdminController::class, 'userIndex'])->name('users');
    Route::get('block/create', [AdminController::class, 'createBlock'])->name('block.create');
    Route::delete('block/{id}', [AdminController::class, 'deleteBlock'])->name('block.delete');
    Route::get('block/{block}/edit', [AdminController::class, 'editBlock'])->name('block.edit');
    Route::put('block/{block}', [AdminController::class, 'updateBlock'])->name('block.update');
    Route::post('block', [AdminController::class, 'storeBlock'])->name('block.store');

    Route::get('user/{user}', [AdminController::class, 'showUser'])->name('user.show');
    Route::get('watchlist/{watchlist}', [AdminController::class, 'showWatchlist'])->name('watchlist.show');
    Route::delete('watchlist/{watchlist}', [AdminController::class, 'deleteWatchlist'])->name('watchlist.delete');
});

// Route::delete();
