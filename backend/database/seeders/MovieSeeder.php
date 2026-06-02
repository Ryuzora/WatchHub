<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $movies = [
            550,     // Fight Club
            155,     // The Dark Knight
            27205,   // Inception
            157336,  // Interstellar
            603,     // The Matrix
        ];

        foreach ($movies as $tmdbMovieId) {
            Movie::firstOrCreate([
                'tmdb_movie_id' => $tmdbMovieId,
            ]);
        }
    }
}
