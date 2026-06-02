<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Watchlist;
use App\Models\WatchlistItem;
use App\Wrappers\TmdbWrapper\Tmdb;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function index(Request $request)
    {
        $watchlists = Watchlist::query()
            ->where('user_id', $request->user()->id)
            ->select(['id', 'user_id', 'title', 'description'])
            ->withCount('items')
            ->orderBy('id')
            ->get();

        return response()->json($watchlists);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $watchlist = Watchlist::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
        ]);

        return response()->json($watchlist, 201);
    }

    public function show(Watchlist $watchlist)
    {
        if ($watchlist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $watchlist->load('items.movie');

        $items = $watchlist->items->map(function ($item) use ($watchlist) {
            return $this->buildWatchlistItem($item, $watchlist);
        });

        return response()->json([
            'id' => $watchlist->id,
            'user_id' => $watchlist->user_id,
            'title' => $watchlist->title,
            'description' => $watchlist->description,
            'items' => $items,
        ]);
    }

    public function storeItem(Request $request, Watchlist $watchlist)
    {
        if ($watchlist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'tmdb_movie_id' => 'required|integer',
        ]);

        $movie = Movie::firstOrCreate(['tmdb_movie_id' => $validated['tmdb_movie_id']]);

        $item = WatchlistItem::create([
            'watchlist_id' => $watchlist->id,
            'movie_id' => $movie->id,
        ]);

        return response()->json($this->buildWatchlistItem($item, $watchlist), 201);
    }

    public function myWatchlists(Request $request)
    {
        $user = $request->user();

        $watchlists = Watchlist::query()
            ->where('user_id', $user->id)
            ->with('items.movie')
            ->orderBy('id')
            ->get();

        $data = $watchlists->map(function ($watchlist) {
            return [
                'id' => $watchlist->id,
                'user_id' => $watchlist->user_id,
                'title' => $watchlist->title,
                'description' => $watchlist->description,
                'items' => $watchlist->items->map(function ($item) use ($watchlist) {
                    return $this->buildWatchlistItem($item, $watchlist);
                })->values(),
            ];
        });

        return response()->json($data);
    }

    private function buildWatchlistItem($item, Watchlist $watchlist): array
    {
        $tmdbId = $item->movie?->tmdb_movie_id;
        $tmdbData = $tmdbId ? Tmdb::get('movie', (string) $tmdbId, ['credits']) : null;

        $director = null;
        if (is_array($tmdbData) && isset($tmdbData['credits']['crew'])) {
            foreach ($tmdbData['credits']['crew'] as $crew) {
                if (($crew['job'] ?? null) === 'Director') {
                    $director = $crew['name'] ?? null;
                    break;
                }
            }
        }

        return [
            'id' => $item->id,
            'watchlist_id' => $item->watchlist_id,
            'movie_id' => $item->movie_id,
            'tmdb_movie_id' => $tmdbId,
            'title' => $tmdbData['title'] ?? null,
            'release_date' => $tmdbData['release_date'] ?? null,
            'rating' => $tmdbData['vote_average'] ?? null,
            'runtime' => $tmdbData['runtime'] ?? null,
            'poster_path' => $tmdbData['poster_path'] ?? null,
            'backdrop_path' => $tmdbData['backdrop_path'] ?? null,
            'director' => $director,
            'watchlist_title' => $watchlist->title,
        ];
    }

    public function destroyItem(Request $request, Watchlist $watchlist, $tmdbId)
    {
        if ($watchlist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $movie = Movie::where('tmdb_movie_id', $tmdbId)->first();
        if (!$movie) {
            return response()->json(['message' => 'Movie not found.'], 404);
        }

        $watchlistItem = WatchlistItem::where('watchlist_id', $watchlist->id)
                                      ->where('movie_id', $movie->id)
                                      ->first();

        if (!$watchlistItem) {
            return response()->json(['message' => 'Item not found in watchlist.'], 404);
        }

        $watchlistItem->delete();

        return response()->json(['message' => 'Item removed successfully.']);
    }
}

