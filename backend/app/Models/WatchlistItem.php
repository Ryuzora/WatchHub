<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WatchlistItem extends Model
{
    protected $fillable = [
        'watchlist_id',
        'movie_id',
    ];

    public function watchlist()
    {
        return $this->belongsTo(Watchlist::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}
