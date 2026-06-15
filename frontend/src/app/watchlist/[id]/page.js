"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import TopNav from "../../components/TopNav";
import WatchlogPopup from "../../components/WatchlogPopup";
import { useAuth } from "@/context/AuthContext";
import { getLikedMovies } from "@/services/likeService";
import { getMovieDetail } from "@/services/movieService";

const popupCategories = ["Now Playing", "Popular", "Top Rated", "Upcoming", "Liked Movies"];

const categoryEndpoints = {
  "Now Playing": "now-playing",
  Popular: "popular",
  "Top Rated": "top-rated",
  Upcoming: "upcoming",
};

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
const backdropBaseUrl = "https://image.tmdb.org/t/p/original";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
  );
  return match ? decodeURIComponent(match[3]) : null;
}

function getReleaseYear(dateString) {
  if (!dateString) return "—";
  const year = Number(dateString.slice(0, 4));
  return Number.isNaN(year) ? "—" : year;
}

function normalizePopupMovies(payload) {
  const items = Array.isArray(payload)
    ? payload
    : payload?.results || payload?.data || [];
  return items.map((item) => ({
    id: item.id ?? item.tmdb_id ?? item.slug ?? item.title,
    title: item.title ?? item.name ?? "Untitled",
    year: getReleaseYear(item.release_date ?? item.first_air_date),
    rating: item.vote_average
      ? Number(item.vote_average).toFixed(1)
      : item.rating ?? "—",
    image:
      item.image ||
      (item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null) ||
      (item.backdrop_path ? `${imageBaseUrl}${item.backdrop_path}` : null),
  }));
}

async function getLikedMovieDetails() {
    const likes = await getLikedMovies();

    const items = Array.isArray(likes)
        ? likes
        : likes?.data || [];

    const detailPromises = items.map(async (item) => {
        const tmdbMovieId =
            item.movie?.tmdb_movie_id ||
            item.tmdb_movie_id ||
            item.movie_id;

        if (!tmdbMovieId) return null;

        const detail = await getMovieDetail(tmdbMovieId);

        if (!detail) return null;

        return {
            id: detail.id,
            title: detail.title ?? "Untitled",
            year: getReleaseYear(detail.release_date),
            rating: detail.vote_average
                ? Number(detail.vote_average).toFixed(1)
                : "—",
            image:
                detail.poster_path
                    ? `${imageBaseUrl}${detail.poster_path}`
                    : detail.backdrop_path
                        ? `${imageBaseUrl}${detail.backdrop_path}`
                        : null,
        };
    });

    const movies = await Promise.all(detailPromises);

    return movies.filter(Boolean);
}

function normalizeLikedMovies(payload) {
    const items = Array.isArray(payload) ? payload : payload?.data || payload?.results || [];

    return items.map((item) => {
        const movie = item.movie || item;

        return {
            id: movie.tmdb_movie_id ?? movie.tmdb_id ?? movie.id,
            title: movie.title ?? "Untitled",
            year: getReleaseYear(movie.release_date ?? movie.first_air_date),
            rating: movie.vote_average
                ? Number(movie.vote_average).toFixed(1)
                : movie.rating
                    ? Number(movie.rating).toFixed(1)
                    : "—",
            image:
                movie.image ||
                (movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : null) ||
                (movie.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : null),
        };
    });
}

function formatDuration(runtime) {
  if (!runtime || Number.isNaN(runtime)) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

function normalizeWatchlistItems(items) {
  return (items || []).map((item) => ({
    id: item.tmdb_movie_id ?? item.movie_id ?? item.id,
    title: item.title ?? "Untitled",
    director: item.director ?? null,
    year: getReleaseYear(item.release_date),
    status: item.watchlist_title ?? "Saved",
    rating: item.vote_average
      ? Number(item.vote_average).toFixed(1)
      : item.rating
      ? Number(item.rating).toFixed(1)
      : null,
    runtime: item.runtime ?? null,
    duration: formatDuration(item.runtime),
    image:
      (item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null) ||
      (item.backdrop_path ? `${imageBaseUrl}${item.backdrop_path}` : null),
    backdrop: item.backdrop_path
      ? `${backdropBaseUrl}${item.backdrop_path}`
      : null,
    overview: item.overview ?? "",
  }));
}

function normalizeWatchlist(payload) {
  return {
    id: payload.id,
    title: payload.title ?? "Untitled",
    description: payload.description ?? "",
    visibility: payload.visibility ?? "private",
    isOwner: payload.is_owner ?? true,
    ownerName: payload.owner?.name ?? null,
    items: normalizeWatchlistItems(payload.items || []),
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

/* ─── Icons ─── */
function IconPlus(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconArrowLeft(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconFilm(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
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

function IconClock(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconStar(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconTrash(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

/* ─── Skeleton Loaders ─── */
function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="h-56 w-full animate-pulse bg-zinc-800/60 md:h-72" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-700/60" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-zinc-700/60 md:h-10 md:w-96" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-zinc-700/60" />
        <div className="mt-5 flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-28 animate-pulse rounded-xl bg-zinc-800/60"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="aspect-2/3 w-full animate-pulse bg-zinc-800/60" />
          <div className="p-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800/60" />
            <div className="mt-2 flex items-center justify-between">
              <div className="h-3 w-10 animate-pulse rounded bg-zinc-800/60" />
              <div className="h-3 w-12 animate-pulse rounded bg-zinc-800/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function WatchlistDetailPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();

  const [watchlist, setWatchlist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    popupCategories[0]
  );
  const [popupMovies, setPopupMovies] = useState([]);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState("");
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadWatchlist = useCallback(
    async (signal) => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(buildApiUrl(`/api/watchlists/${id}`), {
          signal,
          credentials: "include",
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const payload = await response.json();
        setWatchlist(normalizeWatchlist(payload));
      } catch (err) {
        if (!signal?.aborted) setError("Failed to load watchlist details.");
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!user || !id) return;
    const controller = new AbortController();
    loadWatchlist(controller.signal);
    return () => controller.abort();
  }, [user, id, loadWatchlist]);

    useEffect(() => {
        if (!isPopupOpen) return;

        const controller = new AbortController();

        const loadPopupMovies = async () => {
            setIsPopupLoading(true);
            setPopupError("");

            try {
                if (selectedCategory === "Liked Movies") {
                    const movies = await getLikedMovieDetails();
                    setPopupMovies(movies);
                    return;
                }

                const endpoint = categoryEndpoints[selectedCategory];

                if (!endpoint) {
                    setPopupMovies([]);
                    return;
                }

                const response = await fetch(buildApiUrl(`/api/movies/${endpoint}`), {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Request failed (${response.status})`);
                }

                const payload = await response.json();
                setPopupMovies(normalizePopupMovies(payload));
            } catch (error) {
                if (!controller.signal.aborted) {
                    setPopupError("Failed to load movies.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsPopupLoading(false);
                }
            }
        };

        loadPopupMovies();

        return () => controller.abort();
    }, [isPopupOpen, selectedCategory]);

  const handleAddMovie = async (movieId) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const response = await fetch(buildApiUrl(`/api/watchlists/${id}/items`), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: JSON.stringify({ tmdb_movie_id: movieId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add movie.");
      }

      showToast("Movie added successfully!");
      await loadWatchlist(new AbortController().signal);
    } catch (err) {
      showToast(err.message || "An error occurred.", "error");
    }
  };

  const handleDeleteMovie = async (movieId) => {
    setDeletingId(movieId);
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const response = await fetch(
        buildApiUrl(`/api/watchlists/${id}/items/${movieId}`),
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove movie.");
      }

      showToast("Movie removed from watchlist.");
      await loadWatchlist(new AbortController().signal);
    } catch (err) {
      showToast(err.message || "An error occurred.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Compute stats
  const totalMovies = watchlist?.items.length ?? 0;
  const totalRuntime = watchlist?.items.reduce(
    (sum, m) => sum + (m.runtime || 0),
    0
  );
  const avgRating =
    watchlist?.items.length > 0
      ? (
          watchlist.items.reduce(
            (sum, m) => sum + (parseFloat(m.rating) || 0),
            0
          ) / watchlist.items.filter((m) => m.rating).length || 0
        ).toFixed(1)
      : null;

  // Pick hero backdrop from first movie with one
  const heroBackdrop =
    watchlist?.items.find((m) => m.backdrop)?.backdrop ||
    watchlist?.items.find((m) => m.image)?.image;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <TopNav active="Watchlist" />

        {/* Back link */}
        <Link
          href="/watchlist"
          className="group flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-zinc-200"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Watchlists
        </Link>

        {/* Loading state */}
        {isLoading && (
          <>
            <HeroSkeleton />
            <CardsSkeleton />
          </>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 py-20 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => loadWatchlist(new AbortController().signal)}
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loaded content */}
        {!isLoading && !error && watchlist && (
          <>
            {/* Hero Banner */}
            <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
              {/* Backdrop image */}
              <div className="h-56 w-full overflow-hidden md:h-72">
                {heroBackdrop ? (
                  <img
                    src={heroBackdrop}
                    alt={watchlist.title}
                    className="h-full w-full object-cover opacity-50"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
                )}
              </div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10]/80 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {watchlist.visibility} Watchlist
                </div>
                <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                  {watchlist.title}
                </h1>
                {!watchlist.isOwner && watchlist.ownerName && (
                  <p className="mt-1 text-sm text-zinc-500">
                    Shared by {watchlist.ownerName}
                  </p>
                )}
                {watchlist.description && (
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                    {watchlist.description}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                    <IconFilm className="h-4 w-4 text-zinc-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {totalMovies}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Titles
                      </div>
                    </div>
                  </div>
                  {totalRuntime > 0 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                      <IconClock className="h-4 w-4 text-zinc-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {formatDuration(totalRuntime)}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                          Total
                        </div>
                      </div>
                    </div>
                  )}
                  {avgRating && avgRating !== "0.0" && avgRating !== "NaN" && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                      <IconStar className="h-4 w-4 text-yellow-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {avgRating}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                          Avg Rating
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Movie Grid */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {totalMovies > 0
                    ? `${totalMovies} title${totalMovies !== 1 ? "s" : ""} in this list`
                    : "No titles yet"}
                </h2>
              </div>

              {totalMovies === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
                    <IconFilm className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      This watchlist is empty
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Click the button below to start adding movies.
                    </p>
                  </div>
                  {watchlist.isOwner && (
                    <button
                      onClick={() => setIsPopupOpen(true)}
                      className="mt-2 flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                    >
                      <IconPlus className="h-4 w-4" />
                      Add your first title
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {watchlist.items.map((movie) => (
                    <div
                      key={movie.id}
                      className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    >
                      {/* Poster */}
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/detail/${movie.id}?from=${encodeURIComponent(`/watchlist/${id}`)}`)}
                      >
                        {movie.image ? (
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="aspect-2/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex aspect-2/3 w-full items-center justify-center bg-zinc-900/50 text-xs text-zinc-500">
                            No Image
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* Rating badge */}
                      {movie.rating && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-yellow-300 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <IconStar className="h-2.5 w-2.5" />
                          {movie.rating}
                        </div>
                      )}

                      {/* Delete button */}
                      {watchlist.isOwner && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMovie(movie.id);
                          }}
                          disabled={deletingId === movie.id}
                          className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-red-500 group-hover:opacity-100 disabled:opacity-50"
                          title="Remove from watchlist"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm font-semibold leading-tight text-white drop-shadow-lg">
                          {movie.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
                          <span>{movie.year}</span>
                          {movie.duration && (
                            <>
                              <span className="text-zinc-600">·</span>
                              <span>{movie.duration}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Always-visible title below poster (visible on mobile/non-hover) */}
                      <div className="p-3 transition-opacity duration-300 group-hover:opacity-0">
                        <p className="truncate text-sm font-medium text-white">
                          {movie.title}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
                          <span>{movie.year}</span>
                          {movie.duration && <span>{movie.duration}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* FAB */}
      {user && watchlist?.isOwner && (
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] transition hover:bg-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-100">
            <IconPlus className="h-5 w-5" />
          </span>
          Add new title
        </button>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-[120] flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-sm transition-all ${
            toast.type === "error"
              ? "border-red-500/40 bg-red-950/80 text-red-200"
              : "border-emerald-500/40 bg-emerald-950/80 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}

      {/* WatchlogPopup */}
      <WatchlogPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        popupCategories={popupCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        popupMovies={popupMovies}
        isPopupLoading={isPopupLoading}
        popupError={popupError}
        onAddMovie={handleAddMovie}
      />
    </div>
  );
}
