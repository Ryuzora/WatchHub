<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Wrappers\TmdbWrapper\Tmdb;

class MovieController extends Controller
{
    public function show($id)
    {
        if (!ctype_digit((string) $id)) {
            return response()->json([
                'message' => 'Movie id harus berupa angka.'
            ], 422);
        }

        $movie = Tmdb::get('movie', (string) $id);

        return response()->json($movie);
    }
}
