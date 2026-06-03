<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\WatchlistController;
use App\Http\Controllers\Api\ReviewController;

Route::get('/movies/popular', [MovieController::class, 'popular']);
Route::get('/movies/top-rated', [MovieController::class, 'topRated']);
Route::get('/movies/now-playing', [MovieController::class, 'nowPlaying']);
Route::get('/movies/upcoming', [MovieController::class, 'upcoming']);
Route::get('/movies/{tmdbMovieId}/reviews', [ReviewController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/movies/{tmdbMovieId}/reviews', [ReviewController::class, 'store']);
    Route::get('/watchlists', [WatchlistController::class, 'index']);
    Route::post('/watchlists', [WatchlistController::class, 'store']);
    Route::get('/watchlists/me', [WatchlistController::class, 'myWatchlists']);
    Route::get('/watchlists/{watchlist}', [WatchlistController::class, 'show']);
    Route::post('/watchlists/{watchlist}/items', [WatchlistController::class, 'storeItem']);
    Route::delete('/watchlists/{watchlist}/items/{tmdb_id}', [WatchlistController::class, 'destroyItem']);
});
