<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Wrappers\TmdbWrapper\Tmdb;
use App\Models\BlockedAccount;
use App\Models\User;
use App\Models\Watchlist;

class AdminController extends Controller
{
    public function userIndex(){
        $users = BlockedAccount::with('user')->paginate(10);
        // dd($users);
        return Inertia::render('users', ['users' => $users]);
    }

    public function showUser(User $user){
        $watchlists = $user->watchlists;
        return Inertia::render('user-show', ['user' => $user, 'watchlists' => $watchlists]);
    }

    public function showWatchlist(Watchlist $watchlist){
        $watchlistItems = $watchlist->items;

        $movies = $watchlistItems->map(function ($item) {
            try {
                $tmdbData = Tmdb::get('movie', (string) $item->movie_id);

                return [
                    'id' => $item->movie_id,
                    'title' => $tmdbData['title'] ?? 'Unknown Title',
                    'release_year' => isset($tmdbData['release_date']) 
                        ? date('Y', strtotime($tmdbData['release_date'])) 
                        : null,
                    'genre' => isset($tmdbData['genres'][0]['name']) 
                        ? $tmdbData['genres'][0]['name'] 
                        : null,
                ];
            } catch (\Exception $e) {
                Log::error("Failed fetching TMDB data for movie ID {$item->movie_id}: " . $e->getMessage());
                return [
                    'id' => $item->movie_id,
                    'title' => "Movie (ID: {$item->movie_id})",
                    'release_year' => null,
                    'genre' => 'Unavailable',
                ];
            }
        });

        $watchlistData = $watchlist->toArray();
        $watchlistData['movies'] = $movies;

        // dd($watchlistData['movies']);

        return Inertia::render('watchlist-show', ['watchlist' => $watchlistData]);
    }

    public function deleteWatchlist(Watchlist $watchlist){
        $watchlist->delete();
        return back();
    }

    public function createBlock(){
        return Inertia::render('block-create');
    }

    public function deleteBlock($id){
        $block = BlockedAccount::findOrFail($id);
        $block->delete();
        return back();
    }

    public function editBlock(BlockedAccount $block){
        return Inertia::render('block-edit', ['account' => $block->load('user')]);
    }

    public function updateBlock(Request $request, BlockedAccount $block){
        $validated = $request->validate([
            'type' => 'required|in:temporary,permanent',
            'message' => 'required|string|max:255',
        ]);

        $block->update($validated);

        return redirect('users');
    }

    public function storeBlock(Request $request){
        $validated = $request->validate([
            'email'   => 'required|email|exists:users,email',
            'type'    => 'required|in:temporary,permanent',
            'message' => 'required|string|max:255',
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();

        $alreadyBlocked = BlockedAccount::where('user_id', $user->id)->exists();
        if ($alreadyBlocked) {
            return back()->withErrors(['email' => 'An active restriction record already exists for this email.']);
        }

        $block = new BlockedAccount();
        $block->user_id = $user->id;
        $block->type = $validated['type'];
        $block->message = $validated['message'];
        $block->save();

        return redirect()->route('users')->with('success', "Account associated with {$user->email} has been restricted.");
    }
}
