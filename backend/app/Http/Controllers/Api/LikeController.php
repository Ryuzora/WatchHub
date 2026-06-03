<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Movie;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function index(Request $request)
    {
        $likes = Like::with('movie')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($likes);
    }

    public function check(Request $request, $tmdbMovieId)
    {
        $movie = Movie::where('tmdb_movie_id', $tmdbMovieId)->first();

        if (!$movie) {
            return response()->json([
                'liked' => false,
            ]);
        }

        $liked = Like::where('user_id', $request->user()->id)
            ->where('movie_id', $movie->id)
            ->exists();

        return response()->json([
            'liked' => $liked,
        ]);
    }

    public function store(Request $request, $tmdbMovieId)
    {
        $movie = Movie::firstOrCreate([
            'tmdb_movie_id' => $tmdbMovieId,
        ]);

        $like = Like::firstOrCreate([
            'user_id' => $request->user()->id,
            'movie_id' => $movie->id,
        ]);

        return response()->json([
            'message' => 'Movie liked successfully.',
            'data' => $like->load('movie'),
        ], 201);
    }

    public function destroy(Request $request, $tmdbMovieId)
    {
        $movie = Movie::where('tmdb_movie_id', $tmdbMovieId)->first();

        if (!$movie) {
            return response()->json([
                'message' => 'Like not found.',
            ], 404);
        }

        $deleted = Like::where('user_id', $request->user()->id)
            ->where('movie_id', $movie->id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'Like not found.',
            ], 404);
        }

        return response()->json([
            'message' => 'Movie unliked successfully.',
        ]);
    }
}
