<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Wrappers\TmdbWrapper\Tmdb;
use Illuminate\Http\Request;

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

    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $movies = Tmdb::search('movie', $validated['query']);

        return response()->json($movies);
    }

    public function popular(Request $request)
    {
        return $this->getMovieList($request, 'popular');
    }

    public function topRated(Request $request)
    {
        return $this->getMovieList($request, 'top_rated');
    }

    public function nowPlaying(Request $request)
    {
        return $this->getMovieList($request, 'now_playing');
    }

    public function upcoming(Request $request)
    {
        return $this->getMovieList($request, 'upcoming');
    }

    private function getMovieList(Request $request, string $category)
    {
        $page = (int) $request->query('page', 1);
        $language = $request->query('language', 'en-US');
        $region = $request->query('region');

        if ($page < 1) {
            $page = 1;
        }

        $movies = Tmdb::movieList($category, $page, $language, $region);

        return response()->json($movies);
    }
}
