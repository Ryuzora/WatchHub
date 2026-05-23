<?php

use Illuminate\Support\Facades\Route;
use App\Wrappers\TmdbWrapper\Tmdb;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $movie = Tmdb::discover("movie");
        // dd($movie);

        // bawa data ke view
        return Inertia::render('dashboard', ['movie' => $movie]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
