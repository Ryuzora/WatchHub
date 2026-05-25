<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;

Route::get('/movies/popular', [MovieController::class, 'popular']);
Route::get('/movies/top-rated', [MovieController::class, 'topRated']);
Route::get('/movies/now-playing', [MovieController::class, 'nowPlaying']);
Route::get('/movies/upcoming', [MovieController::class, 'upcoming']);
Route::get('/movies/{id}', [MovieController::class, 'show']);
