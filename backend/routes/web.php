<?php

use Illuminate\Support\Facades\Route;
use App\Wrappers\TmdbWrapper\Tmdb;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('tmdb-wrapper-test', function () {
    $query = trim((string) request('query', ''));

    if ($query !== '') {
        $movie = Tmdb::search('movie', $query);

        return response()->json($movie);
    }

    $movieId = request('id', '550');

    if (!ctype_digit((string) $movieId)) {
        return response()->json(['error' => 'Movie id must be numeric.'], 422);
    }

    $movie = Tmdb::get('movie', (string) $movieId);

    return response()->json($movie);
})->name('tmdb-wrapper-test');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $movie = Tmdb::get("movie", "550", ["images"]);

        // bawa data ke view
        return Inertia::render('dashboard', ['movie' => $movie]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
