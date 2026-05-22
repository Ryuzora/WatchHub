<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        // request data film dengan id 550.
        $response = Http::withToken(config('services.tmdb.bearer_token'))
            ->get('https://api.themoviedb.org/3/movie/550');

        $movie = $response->json();
        // dd($movie) <- untuk melihat datanya. (buat debugging doang)

        // bawa data ke view
        return Inertia::render('dashboard', ['movie' => $movie]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
