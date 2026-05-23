<?php

namespace App\Wrappers\TmdbWrapper;
use Illuminate\Support\Facades\Http;

class Tmdb {
    private static $domain = 'https://api.themoviedb.org/3';

    public static function get(string $type, string $id){
        $response = Http::withToken(config('services.tmdb.bearer_token'))
        ->get(self::$domain . "/$type/$id");

        $json = $response->json();

        return $json;
    }

    public static function discover(string $type){
        $response = Http::withToken(config('services.tmdb.bearer_token'))
        ->get(self::$domain . "/discover/$type");

        $json = $response->json();
        return $json;
    }
}

?>