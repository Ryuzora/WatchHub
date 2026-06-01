<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            return;
        }

        $fightClub = Movie::where('tmdb_movie_id', 550)->first();
        $interstellar = Movie::where('tmdb_movie_id', 157336)->first();

        if ($fightClub) {
            Review::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'movie_id' => $fightClub->id,
                ],
                [
                    'rating' => 9,
                    'comment' => 'Filmnya bagus dan mind-blowing.',
                ]
            );
        }

        if ($interstellar) {
            Review::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'movie_id' => $interstellar->id,
                ],
                [
                    'rating' => 10,
                    'comment' => 'Visual dan ceritanya sangat kuat.',
                ]
            );
        }
    }
}
