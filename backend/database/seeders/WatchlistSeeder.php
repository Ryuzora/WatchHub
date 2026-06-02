<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Seeder;

class WatchlistSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password',
            ]);
        }

        Watchlist::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Film Favorit',
            ],
            [
                'description' => 'Kumpulan film favorit saya.',
            ]
        );

        Watchlist::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Nonton Weekend',
            ],
            [
                'description' => 'Film yang ingin ditonton saat weekend.',
            ]
        );

        Watchlist::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'Film Sci-Fi',
            ],
            [
                'description' => 'Kumpulan film bertema science fiction.',
            ]
        );
    }
}
