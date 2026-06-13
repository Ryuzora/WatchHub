"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchMovies } from "@/services/movieService";

const imageBaseUrl = "https://image.tmdb.org/t/p/w92";

function IconSearch(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </svg>
    );
}

export default function MovieSearchOverlay({
    isOpen,
    onClose,
    onSelect,
    placeholder = "Search...",
}) {
    const router = useRouter();
    const inputRef = useRef(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const focusTimeout = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 0);

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.clearTimeout(focusTimeout);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!isOpen || trimmedQuery.length < 2) {
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            setIsSearching(true);
            setError("");

            try {
                const movies = await searchMovies(trimmedQuery);
                setResults(movies.slice(0, 8));
            } catch (searchError) {
                setResults([]);
                setError("Search failed.");
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [isOpen, query]);

    if (!isOpen) {
        return null;
    }

    const handleQueryChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.trim().length < 2) {
            setResults([]);
            setError("");
            setIsSearching(false);
        }
    };

    const selectMovie = (movie) => {
        if (onSelect) {
            onSelect(movie);
        } else {
            const from = typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : "/";

            router.push(`/detail/${movie.id}?from=${encodeURIComponent(from)}`);
        }

        onClose();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (results[0]) {
            selectMovie(results[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-md">
            <button
                type="button"
                aria-label="Close search"
                className="absolute inset-0 cursor-default"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl">
                <form
                    onSubmit={handleSubmit}
                    className="relative rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-6"
                >
                    <button
                        type="button"
                        aria-label="Close search"
                        onClick={onClose}
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-xl leading-none text-zinc-400 shadow-lg shadow-black/40 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
                    >
                        &times;
                    </button>

                    <div className="relative">
                        <IconSearch className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-500" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={handleQueryChange}
                            placeholder={placeholder}
                            className="h-16 w-full rounded-lg border border-zinc-700 bg-zinc-900/80 pl-16 pr-5 text-xl text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20"
                        />
                    </div>
                </form>

                <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                    {query.trim().length < 2 && (
                        <div className="px-5 py-4 text-sm text-zinc-500">
                            Type at least 2 characters to search TMDB movies.
                        </div>
                    )}

                    {query.trim().length >= 2 && isSearching && (
                        <div className="px-5 py-4 text-sm text-zinc-500">
                            Searching...
                        </div>
                    )}

                    {error && (
                        <div className="px-5 py-4 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {!isSearching && !error && query.trim().length >= 2 && results.length === 0 && (
                        <div className="px-5 py-4 text-sm text-zinc-500">
                            No movies found.
                        </div>
                    )}

                    {!isSearching && results.length > 0 && (
                        <div className="max-h-[34rem] overflow-y-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {results.map((movie) => {
                                const content = (
                                    <>
                                        {movie.poster_path ? (
                                            <img
                                                src={`${imageBaseUrl}${movie.poster_path}`}
                                                alt={movie.title}
                                                className="h-24 w-16 shrink-0 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs text-zinc-600">
                                                N/A
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <div className="truncate text-lg font-semibold text-zinc-100">
                                                {movie.title}
                                            </div>
                                            <div className="mt-1 text-sm text-zinc-500">
                                                {movie.release_date ? movie.release_date.slice(0, 4) : "Unknown year"}
                                            </div>
                                            {movie.overview && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                                                    {movie.overview}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                );

                                if (onSelect) {
                                    return (
                                        <button
                                            key={movie.id}
                                            type="button"
                                            onClick={() => selectMovie(movie)}
                                            className="flex w-full gap-4 px-6 py-4 text-left transition hover:bg-zinc-900/80"
                                        >
                                            {content}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={movie.id}
                                        href={`/detail/${movie.id}?from=${encodeURIComponent(
                                            typeof window !== "undefined"
                                                ? `${window.location.pathname}${window.location.search}`
                                                : "/"
                                        )}`}
                                        onClick={onClose}
                                        className="flex gap-4 px-6 py-4 transition hover:bg-zinc-900/80"
                                    >
                                        {content}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
