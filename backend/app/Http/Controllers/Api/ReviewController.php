<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($tmdbMovieId)
    {
        $movie = Movie::where('tmdb_movie_id', $tmdbMovieId)->first();

        if (!$movie) {
            return response()->json([]);
        }

        $reviews = Review::with('user')
            ->where('movie_id', $movie->id)
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request, $tmdbMovieId)
    {
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:10'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $movie = Movie::firstOrCreate([
            'tmdb_movie_id' => $tmdbMovieId,
        ]);

        $review = Review::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'movie_id' => $movie->id,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'Review saved successfully.',
            'data' => $review->load('user'),
        ], 201);
    }
}
