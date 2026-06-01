<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'tmdb_movie_id',
    ];

    public function watchlistItems()
    {
        return $this->hasMany(WatchlistItem::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
