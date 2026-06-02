<?php

namespace App\Wrappers\TmdbWrapper;
use Illuminate\Support\Facades\Http;

class Tmdb {
    private static $domain = 'https://api.themoviedb.org/3';


    public static function get(string $type, string $id, array $extra = null){
        $request = self::$domain . "/$type/$id";
        if(!empty($extra) or $extra != null){
            $args = implode(",", $extra);
            $request = $request . "?append_to_response=$args";
        }

        $response = Http::withToken(config('services.tmdb.bearer_token'))
        ->get($request);

        $json = $response->json();

        return $json;
    }

    public static function discover(string $type){
        $response = Http::withToken(config('services.tmdb.bearer_token'))
        ->get(self::$domain . "/discover/$type");

        $json = $response->json();
        return $json;
    }

    public static function search(string $type, string $query){
        $response = Http::withToken(config('services.tmdb.bearer_token'))
        ->get(self::$domain . "/search/$type", [
            'query' => $query,
        ]);

        $json = $response->json();
        return $json;
    }

    public static function movieList(string $category, int $page = 1, string $language = 'en-US', ?string $region = null)
    {
        $query = [
            'language' => $language,
            'page' => $page,
        ];

        if ($region) {
            $query['region'] = $region;
        }

        $response = Http::withToken(config('services.tmdb.bearer_token'))
            ->get(self::$domain . "/movie/$category", $query);

        return $response->json();
    }
}

?>
