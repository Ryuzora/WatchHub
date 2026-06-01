<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Watchlist;
use App\Models\WatchlistItem;
use Illuminate\Database\Seeder;

class WatchlistItemSeeder extends Seeder
{
    public function run(): void
    {
        $filmFavorit = Watchlist::where('title', 'Film Favorit')->first();
        $nontonWeekend = Watchlist::where('title', 'Nonton Weekend')->first();
        $filmScifi = Watchlist::where('title', 'Film Sci-Fi')->first();

        $fightClub = Movie::where('tmdb_movie_id', 550)->first();
        $darkKnight = Movie::where('tmdb_movie_id', 155)->first();
        $inception = Movie::where('tmdb_movie_id', 27205)->first();
        $interstellar = Movie::where('tmdb_movie_id', 157336)->first();
        $matrix = Movie::where('tmdb_movie_id', 603)->first();

        if ($filmFavorit && $fightClub) {
            WatchlistItem::firstOrCreate([
                'watchlist_id' => $filmFavorit->id,
                'movie_id' => $fightClub->id,
            ]);
        }

        if ($filmFavorit && $darkKnight) {
            WatchlistItem::firstOrCreate([
                'watchlist_id' => $filmFavorit->id,
                'movie_id' => $darkKnight->id,
            ]);
        }

        if ($nontonWeekend && $inception) {
            WatchlistItem::firstOrCreate([
                'watchlist_id' => $nontonWeekend->id,
                'movie_id' => $inception->id,
            ]);
        }

        if ($filmScifi && $interstellar) {
            WatchlistItem::firstOrCreate([
                'watchlist_id' => $filmScifi->id,
                'movie_id' => $interstellar->id,
            ]);
        }

        if ($filmScifi && $matrix) {
            WatchlistItem::firstOrCreate([
                'watchlist_id' => $filmScifi->id,
                'movie_id' => $matrix->id,
            ]);
        }
    }
}
