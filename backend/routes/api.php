<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;

Route::get('/movies/{id}', [MovieController::class, 'show']);
