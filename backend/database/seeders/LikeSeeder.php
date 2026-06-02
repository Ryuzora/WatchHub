<?php

namespace Database\Seeders;

use App\Models\Like;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            return;
        }

        $movies = Movie::whereIn('tmdb_movie_id', [
            550,
            155,
            157336,
        ])->get();

        foreach ($movies as $movie) {
            Like::firstOrCreate([
                'user_id' => $user->id,
                'movie_id' => $movie->id,
            ]);
        }
    }
}
