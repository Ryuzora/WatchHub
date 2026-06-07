<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(WatchlistItem::class);
    }

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'watchlist_items', 'watchlist_id', 'movie_id')->withTimestamps();
    }
}
