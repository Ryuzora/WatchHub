"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopNav from "./components/TopNav";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

function buildApiUrl(path) {
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

const ROWS = [
    { key: "popular", label: "Popular", endpoint: "/api/movies/popular" },
    { key: "top-rated", label: "Top Rated", endpoint: "/api/movies/top-rated" },
    { key: "upcoming", label: "Upcoming", endpoint: "/api/movies/upcoming" },
];

function getReleaseYear(dateStr) {
    if (!dateStr) return "—";
    const y = Number(dateStr.slice(0, 4));
    return Number.isNaN(y) ? "—" : y;
}

function normalizeMovies(payload) {
    const items = payload?.results || [];
    return items.map((m) => ({
        id: m.id,
        title: m.title,
        year: getReleaseYear(m.release_date),
        rating: m.vote_average ? Number(m.vote_average).toFixed(1) : "—",
        poster: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
        backdrop: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
        overview: m.overview,
    }));
}

function IconPlay(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function IconChevronLeft(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M15 19l-7-7 7-7" />
        </svg>
    );
}

function IconChevronRight(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path d="M9 5l7 7-7 7" />
        </svg>
    );
}

function MovieRow({ label, endpoint }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(buildApiUrl(endpoint), { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setMovies(normalizeMovies(data));
            } catch (err) {
                if (!controller.signal.aborted) console.error(`Failed to load ${label}:`, err);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [endpoint, label]);

    const scroll = useCallback((dir) => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }, []);

    return (
        <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white md:text-xl">{label}</h2>
                <div className="flex gap-1">
                    <button
                        onClick={() => scroll("left")}
                        className="rounded-full border border-zinc-800 p-1.5 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                        aria-label={`Scroll ${label} left`}
                    >
                        <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="rounded-full border border-zinc-800 p-1.5 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                        aria-label={`Scroll ${label} right`}
                    >
                        <IconChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex gap-3 overflow-hidden">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-2/3 w-36 shrink-0 animate-pulse rounded-xl bg-zinc-800/60 md:w-44"
                        />
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="scrollbar-dark -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 scroll-smooth"
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => router.push(`/detail/${movie.id}?from=${encodeURIComponent("/")}`)}
                            className="group relative w-36 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-transparent transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] md:w-44"
                        >
                            {movie.poster ? (
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="aspect-2/3 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex aspect-2/3 w-full items-center justify-center bg-zinc-900 text-xs text-zinc-500">
                                    No Image
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <p className="text-sm font-semibold leading-tight text-white drop-shadow-lg">
                                    {movie.title}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
                                    <span>{movie.year}</span>
                                    <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-yellow-300">
                                        ★ {movie.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function HeroSkeleton() {
    return (
        <section className="relative mb-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="grid min-h-[22rem] gap-0 lg:grid-cols-2 lg:min-h-[28rem]">
                <div className="relative h-64 w-full overflow-hidden lg:h-full">
                    <div className="h-full w-full animate-pulse bg-zinc-800/60" />
                </div>

                <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-800/60" />
                    <div className="flex flex-col gap-2">
                        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-zinc-800/60" />
                        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-zinc-800/60" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-12 animate-pulse rounded bg-zinc-800/60" />
                        <div className="h-4 w-16 animate-pulse rounded bg-zinc-800/60" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="h-3.5 w-full max-w-lg animate-pulse rounded bg-zinc-800/60" />
                        <div className="h-3.5 w-5/6 max-w-lg animate-pulse rounded bg-zinc-800/60" />
                        <div className="h-3.5 w-2/3 max-w-lg animate-pulse rounded bg-zinc-800/60" />
                    </div>
                    <div className="mt-2 h-10 w-36 animate-pulse rounded-lg bg-zinc-800/60" />
                </div>
            </div>
        </section>
    );
}

function HeroSection({ movie, loading }) {
    const router = useRouter();

    if (loading) return <HeroSkeleton />;
    if (!movie) return null;

    return (
        <section className="relative mb-12 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid min-h-[22rem] gap-0 lg:grid-cols-2 lg:min-h-[28rem]">
                <div className="relative h-64 w-full overflow-hidden lg:h-full">
                    <img
                        src={movie.backdrop || movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden" />
                </div>

                {/* Info side */}
                <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                    <span className="w-fit rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Now Playing
                    </span>
                    <h2 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
                        {movie.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span>{movie.year}</span>
                        <span className="text-yellow-400">★ {movie.rating}</span>
                    </div>
                    {movie.overview && (
                        <p className="line-clamp-3 max-w-lg text-sm leading-relaxed text-zinc-400">
                            {movie.overview}
                        </p>
                    )}
                    <button
                        onClick={() => router.push(`/detail/${movie.id}?from=${encodeURIComponent("/")}`)}
                        className="mt-2 flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-zinc-200"
                    >
                        <IconPlay className="h-4 w-4" />
                        View Details
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ─── Main page ─── */
export default function Home() {
    const [heroMovie, setHeroMovie] = useState(null);
    const [heroLoading, setHeroLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            setHeroLoading(true);
            try {
                const res = await fetch(buildApiUrl("/api/movies/now-playing"), {
                    signal: controller.signal,
                });
                if (!res.ok) return;
                const data = await res.json();
                const movies = normalizeMovies(data);
                if (movies.length > 0) setHeroMovie(movies[0]);
            } catch {
                /* ignore */
            } finally {
                if (!controller.signal.aborted) setHeroLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    return (
        <div className="min-h-screen bg-black text-zinc-100">
            <div className="mx-auto w-full max-w-7xl px-6 py-6">
                <TopNav active="Dashboard" />

                {/* Big hero – Latest Watch */}
                <HeroSection movie={heroMovie} loading={heroLoading} />

                {/* Netflix-style category rows */}
                {ROWS.map((row) => (
                    <MovieRow key={row.key} label={row.label} endpoint={row.endpoint} />
                ))}
            </div>
        </div>
    );
}
