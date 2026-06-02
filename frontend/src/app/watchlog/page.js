"use client";

import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";

const filters = ["All", "Watching", "Completed", "Plan to Watch"];

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

function getReleaseYear(dateString) {
  if (!dateString) {
    return "—";
  }

  const year = Number(dateString.slice(0, 4));
  return Number.isNaN(year) ? "—" : year;
}

function formatDuration(runtime) {
  if (!runtime || Number.isNaN(runtime)) {
    return "—";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function normalizeWatchlistItems(items, watchlistTitle) {
  return (items || []).map((item) => ({
    id: item.tmdb_movie_id ?? item.movie_id ?? item.id,
    title: item.title ?? "Untitled",
    director: item.director ?? "—",
    year: getReleaseYear(item.release_date),
    status: watchlistTitle ?? item.watchlist_title ?? "Saved",
    rating: item.rating ? Number(item.rating).toFixed(1) : "—",
    duration: formatDuration(item.runtime),
    image:
      (item.backdrop_path ? `${imageBaseUrl}${item.backdrop_path}` : null) ||
      (item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null),
  }));
}

function normalizeWatchlists(payload) {
  const watchlists = Array.isArray(payload) ? payload : [];

  return watchlists.map((watchlist) => ({
    id: watchlist.id,
    title: watchlist.title ?? "Untitled",
    description: watchlist.description ?? "",
    items: normalizeWatchlistItems(watchlist.items || [], watchlist.title),
  }));
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export default function Watchlog() {
  const [watchlists, setWatchlists] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const loadWatchlist = async () => {
      setIsWatchlistLoading(true);
      setWatchlistError("");

      try {
        const response = await fetch(buildApiUrl("/api/watchlists/me"), {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = await response.json();
        const normalized = normalizeWatchlists(payload);

        if (isActive) {
          setWatchlists(normalized);
        }
      } catch (error) {
        if (!controller.signal.aborted && isActive) {
          setWatchlistError("Failed to load watchlists.");
          setWatchlists([]);
        }
      } finally {
        if (isActive) {
          setIsWatchlistLoading(false);
        }
      }
    };

    loadWatchlist();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <TopNav active="Watchlist"/>

        <section className="flex flex-col gap-4">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Watchlist Dashboard</div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">Your Watchlist</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Archive and track your cinematic journey.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-zinc-900 p-1 text-xs font-medium text-zinc-300">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  className={`rounded-full px-4 py-1.5 transition ${
                    index === 0
                      ? "bg-zinc-100 text-zinc-900"
                      : "hover:text-zinc-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isWatchlistLoading && (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-400">
              Loading watchlists...
            </div>
          )}
          {!isWatchlistLoading && watchlistError && (
            <div className="rounded-2xl border border-dashed border-red-500/60 p-6 text-center text-sm text-red-200">
              {watchlistError}
            </div>
          )}
          {!isWatchlistLoading && !watchlistError && watchlists.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-400">
              No watchlists yet. Create one to get started.
            </div>
          )}
          {!isWatchlistLoading && !watchlistError && watchlists.length > 0 &&
            watchlists.map((watchlist) => (
              <div key={watchlist.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{watchlist.title}</h2>
                    {watchlist.description && (
                      <p className="mt-1 text-sm text-zinc-400">{watchlist.description}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">
                    {watchlist.items.length} titles
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {watchlist.items.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-400">
                      No movies in this watchlist yet.
                    </div>
                  )}
                  {watchlist.items.map((movie) => (
                    <article
                      key={movie.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.8)]"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        {movie.image ? (
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 text-xs text-zinc-400">
                            No image
                          </div>
                        )}
                        <span className="absolute right-3 top-3 rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100">
                          {movie.status}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div>
                          <h3 className="text-base font-semibold text-white">{movie.title}</h3>
                          <p className="text-xs text-zinc-400">{movie.director}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
                          <span>{movie.year}</span>
                          <span>{movie.duration}</span>
                          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-200">
                            {movie.rating}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}
