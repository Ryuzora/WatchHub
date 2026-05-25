"use client";

import { useState } from 'react';
import { forEach } from 'eslint-config-next';

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

async function fetchMovieById(movieId) {
    try {
        const response = await fetch(`${backendBaseUrl}/tmdb-wrapper-test?id=${encodeURIComponent(movieId)}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const errorMessage = errorPayload?.error || `Request failed: ${response.status}`;
            return { error: errorMessage };
        }

        return await response.json();
    } catch (error) {
        return { error: error?.message || 'Unknown error' };
    }
}

async function fetchMovieByTitle(movieTitle) {
    try {
        const response = await fetch(`${backendBaseUrl}/tmdb-wrapper-test?query=${encodeURIComponent(movieTitle)}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const errorMessage = errorPayload?.error || `Request failed: ${response.status}`;
            return { error: errorMessage };
        }

        const payload = await response.json();
        if (payload && Array.isArray(payload.results)) {
            return payload.results[0] || { error: 'No results found.' };
        }

        return payload;
    } catch (error) {
        return { error: error?.message || 'Unknown error' };
    }
}

export const dynamic = 'force-dynamic';

export default function TmdbWrapperTestPage() {
    const [movieId, setMovieId] = useState('550');
    const [movieTitle, setMovieTitle] = useState("Star Wars")
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = await fetchMovieById(movieId.trim());
        setMovie(data);
        setIsLoading(false);
    };

    const titleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = await fetchMovieByTitle(movieTitle.trim());
        setMovie(data);
        setIsLoading(false);
    }

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: 20, fontWeight: 600 }}>TMDB Wrapper Test</h1>
            <p style={{ marginTop: 8, color: '#666' }}>
                Source: {backendBaseUrl}/tmdb-wrapper-test
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                    Movie ID
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        type="text"
                        value={movieId}
                        onChange={(event) => setMovieId(event.target.value)}
                        placeholder="e.g. 550"
                        style={{ padding: 8, minWidth: 200 }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        {isLoading ? 'Loading...' : 'Fetch'}
                    </button>
                </div>
            </form>

            <form onSubmit={titleSubmit} style={{ marginTop: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                    Movie Name
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        type="text"
                        value={movieTitle}
                        onChange={(event) => setMovieTitle(event.target.value)}
                        placeholder="Star Wars"
                        style={{ padding: 8, minWidth: 200 }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        {isLoading ? 'Loading...' : 'Fetch'}
                    </button>
                </div>
            </form>

            {movie ? (
                'error' in movie ? (
                    <div style={{ marginTop: 16, color: '#b00020' }}>
                        Error: {movie.error}
                    </div>
                ) : (
                    <div style={{ marginTop: 16 }}>
                        <div>id: {movie?.id ?? 'missing'}</div>
                        <div>title: {movie?.title ?? 'missing'}</div>
                        <div>release: {movie?.release_date ?? 'missing'}</div>
                        <div style={{ maxWidth: 720 }}>overview: {movie?.overview ?? 'missing'}</div>
                        {movie?.poster_path ? (
                            <div>
                                Poster{' '}
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie?.title || 'Poster'}
                                />
                            </div>
                        ) : null}
                    </div>
                )
            ) : (
                <div style={{ marginTop: 16, color: '#666' }}>Enter a movie id to fetch data.</div>
            )}

            <pre
                style={{
                    marginTop: 16,
                    padding: 12,
                    background: '#000',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    overflow: 'auto',
                    fontSize: 12,
                }}
            >
                {JSON.stringify(movie, null, 2)}
            </pre>
        </div>
    );
}
