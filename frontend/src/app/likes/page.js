"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { useAuth } from "@/context/AuthContext";
import { getLikedMovies } from "@/services/likeService";
import { getMovieDetail } from "@/services/movieService";

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

function IconHeart(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    );
}

function IconFilm(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <path d="M7 2v20" />
            <path d="M17 2v20" />
            <path d="M2 12h20" />
            <path d="M2 7h5" />
            <path d="M2 17h5" />
            <path d="M17 17h5" />
            <path d="M17 7h5" />
        </svg>
    );
}

function IconArrowRight(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
        </svg>
    );
}

function IconLock(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );
}

function HeroSkeleton() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="grid min-h-[16rem] gap-0 md:grid-cols-[1.2fr_1fr] lg:min-h-[20rem]">
                <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                    <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/60" />
                    <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-800/60" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
                    <div className="mt-2 flex gap-4">
                        <div className="h-20 w-28 animate-pulse rounded-xl bg-zinc-800/60" />
                    </div>
                </div>
                <div className="hidden animate-pulse bg-zinc-800/40 md:block" />
            </div>
        </section>
    );
}

function CardsSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="h-[320px] animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40"
                />
            ))}
        </div>
    );
}

function MovieCard({ movie }) {
    const posterUrl = movie.poster_path
        ? `${imageBaseUrl}${movie.poster_path}`
        : null;

    return (
        <Link
            href={`/detail/${movie.id}`}
            className="group relative block h-[320px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
            {posterUrl ? (
                <img
                    src={posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900/80">
                    <IconFilm className="h-8 w-8 text-zinc-700" />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="line-clamp-1 text-base font-semibold text-white">
                    {movie.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
          <span>
            {movie.release_date ? movie.release_date.slice(0, 4) : "-"}
          </span>

                    <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-900">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "-"}
          </span>
                </div>
            </div>
        </Link>
    );
}

export default function LikesPage() {
    const { user, isAuthLoading } = useAuth();

    const [movies, setMovies] = useState([]);
    const [isLikesLoading, setIsLikesLoading] = useState(true);
    const [likesError, setLikesError] = useState("");

    const loadLikedMovies = async () => {
        setIsLikesLoading(true);
        setLikesError("");

        try {
            const likes = await getLikedMovies();

            const movieDetails = await Promise.all(
                likes.map(async (like) => {
                    const movie = await getMovieDetail(like.movie.tmdb_movie_id);

                    return movie
                        ? {
                            ...movie,
                            listKey: like.id,
                        }
                        : null;
                })
            );

            setMovies(movieDetails.filter(Boolean));
        } catch (error) {
            setLikesError("Failed to load liked movies.");
            setMovies([]);
        } finally {
            setIsLikesLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setMovies([]);
            setIsLikesLoading(false);
            return;
        }

        loadLikedMovies();
    }, [user]);

    const totalMovies = movies.length;

    return (
        <div className="min-h-screen bg-[#0b0c10] text-zinc-100">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8">
                <TopNav active="Likes" />

                {isAuthLoading && (
                    <>
                        <HeroSkeleton />
                        <CardsSkeleton />
                    </>
                )}

                {!isAuthLoading && !user && (
                    <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
                        <div
                            className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: "32px 32px",
                            }}
                        />

                        <div className="relative flex flex-col items-center justify-center gap-5 px-6 py-24 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-900/70">
                                <IconLock className="h-8 w-8 text-zinc-400" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Sign in required
                                </h2>

                                <p className="mt-2 max-w-sm text-sm text-zinc-400">
                                    Sign in to see all movies you have liked.
                                </p>
                            </div>

                            <Link
                                href="/login?redirect=/likes"
                                className="mt-2 flex items-center gap-2 rounded-full bg-zinc-100 px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                            >
                                Go to Login
                                <IconArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                )}

                {!isAuthLoading && user && (
                    <>
                        {isLikesLoading ? (
                            <HeroSkeleton />
                        ) : (
                            <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-cyan-500/[0.03]" />

                                <div className="relative grid min-h-[16rem] gap-0 md:grid-cols-[1.2fr_1fr] lg:min-h-[20rem]">
                                    <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                                            Likes Dashboard
                                        </div>

                                        <h1 className="text-3xl font-bold text-white md:text-4xl">
                                            Your Liked Movies
                                        </h1>

                                        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                                            Save your favorite movies by liking them. All liked movies will be collected here.
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                                                <IconHeart className="h-4 w-4 text-zinc-400" />
                                                <div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {totalMovies}
                                                    </div>
                                                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                                                        {totalMovies === 1 ? "Movie" : "Movies"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative hidden overflow-hidden md:block">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="grid grid-cols-3 gap-3 rotate-[-8deg] scale-110 opacity-20">
                                                {Array.from({ length: 9 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-28 w-20 rounded-lg bg-zinc-700/50"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
                                    </div>
                                </div>
                            </section>
                        )}

                        <section>
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">
                                    {isLikesLoading
                                        ? "Loading..."
                                        : likesError
                                            ? "Error"
                                            : totalMovies > 0
                                                ? `${totalMovies} liked movie${totalMovies !== 1 ? "s" : ""}`
                                                : "No liked movies yet"}
                                </h2>
                            </div>

                            {isLikesLoading && <CardsSkeleton />}

                            {!isLikesLoading && likesError && (
                                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 py-16 text-center">
                                    <p className="text-sm text-red-300">{likesError}</p>
                                    <button
                                        onClick={loadLikedMovies}
                                        className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {!isLikesLoading && !likesError && movies.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-20 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
                                        <IconHeart className="h-8 w-8" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-zinc-300">
                                            No liked movies yet
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Open a movie detail page and press Like to save it here.
                                        </p>
                                    </div>

                                    <Link
                                        href="/"
                                        className="mt-2 flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                                    >
                                        Explore movies
                                        <IconArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}

                            {!isLikesLoading && !likesError && movies.length > 0 && (
                                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                    {movies.map((movie) => (
                                        <MovieCard key={movie.listKey} movie={movie} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
