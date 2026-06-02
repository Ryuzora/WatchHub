"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

function normalizeWatchlists(payload) {
  const watchlists = Array.isArray(payload) ? payload : [];
  return watchlists.map((watchlist) => {
    const firstItem = watchlist.items?.[0] ?? null;
    const thumbnail = firstItem
      ? (firstItem.poster_path ? `${imageBaseUrl}${firstItem.poster_path}` : null) ||
        (firstItem.backdrop_path ? `${imageBaseUrl}${firstItem.backdrop_path}` : null)
      : null;
    return {
      id: watchlist.id,
      title: watchlist.title ?? "Untitled",
      description: watchlist.description ?? "",
      totalItems: watchlist.items_count ?? watchlist.items?.length ?? 0,
      thumbnail,
    };
  });
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
  );
  return match ? decodeURIComponent(match[3]) : null;
}

/* ─── Icons ─── */
function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

function IconList(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
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

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

/* ─── Skeletons ─── */
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="w-1/3 shrink-0 animate-pulse bg-zinc-800/60" />
          <div className="flex flex-1 flex-col justify-center gap-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-800/60" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-800/60" />
            <div className="mt-2 h-4 w-20 animate-pulse rounded bg-zinc-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function WatchlistPage() {
  const { user, isAuthLoading } = useAuth();

  const [watchlists, setWatchlists] = useState([]);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(true);
  const [watchlistError, setWatchlistError] = useState("");

  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadWatchlists = async (signal) => {
    setIsWatchlistLoading(true);
    setWatchlistError("");

    try {
      const response = await fetch(buildApiUrl("/api/watchlists/me"), {
        signal,
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const payload = await response.json();
      setWatchlists(normalizeWatchlists(payload));
    } catch (error) {
      if (!signal?.aborted) {
        setWatchlistError("Failed to load watchlists.");
        setWatchlists([]);
      }
    } finally {
      if (!signal?.aborted) {
        setIsWatchlistLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    loadWatchlists(controller.signal);

    return () => controller.abort();
  }, [user]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    setCreateError("");
    setIsCreating(true);

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");

      const response = await fetch(buildApiUrl("/api/watchlists"), {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message || "Failed to create watchlist.";
        throw new Error(message);
      }

      setCreateForm({ title: "", description: "" });
      setIsCreatePopupOpen(false);
      showToast("Watchlist created!");
      await loadWatchlists();
    } catch (error) {
      setCreateError(error?.message || "Failed to create watchlist.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWatchlist = async (watchlistId) => {
    setDeletingId(watchlistId);
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const response = await fetch(buildApiUrl(`/api/watchlists/${watchlistId}`), {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete watchlist.");
      }

      showToast("Watchlist deleted.");
      await loadWatchlists();
    } catch (err) {
      showToast(err.message || "An error occurred.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const totalLists = watchlists.length;
  const totalTitles = watchlists.reduce((sum, w) => sum + w.totalItems, 0);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <TopNav active="Watchlist" />

        {isAuthLoading && (
          <>
            <HeroSkeleton />
            <CardsSkeleton />
          </>
        )}

        {!isAuthLoading && !user && (
          <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }} />

            <div className="relative flex flex-col items-center justify-center gap-5 py-24 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-900/70">
                <IconLock className="h-8 w-8 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Sign in required</h2>
                <p className="mt-2 max-w-sm text-sm text-zinc-400">
                  Keep track of your favorite movies and organize them into watchlists.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-2 flex items-center gap-2 rounded-full bg-zinc-100 px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
              >
                Go to Login
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Logged in */}
        {!isAuthLoading && user && (
          <>
            {/* Hero Section */}
            {isWatchlistLoading ? (
              <HeroSkeleton />
            ) : (
              <section className="relative overflow-hidden rounded-2xl border border-zinc-800">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-cyan-500/[0.03]" />

                <div className="relative grid min-h-[16rem] gap-0 md:grid-cols-[1.2fr_1fr] lg:min-h-[20rem]">
                  {/* Left — Info */}
                  <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Watchlist Dashboard
                    </div>
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                      Your Watchlists
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                      Create collections and keep your movie plans organized. Build your perfect watch queue.
                    </p>

                    {/* Stats */}
                    <div className="mt-2 flex flex-wrap gap-3">
                      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                        <IconList className="h-4 w-4 text-zinc-400" />
                        <div>
                          <div className="text-sm font-semibold text-white">{totalLists}</div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {totalLists === 1 ? "List" : "Lists"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-sm">
                        <IconFilm className="h-4 w-4 text-zinc-400" />
                        <div>
                          <div className="text-sm font-semibold text-white">{totalTitles}</div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                            {totalTitles === 1 ? "Title" : "Titles"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right — Decorative */}
                  <div className="relative hidden overflow-hidden md:block">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-3 rotate-[-8deg] scale-110 opacity-20">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-28 w-20 rounded-lg bg-zinc-700/50"
                            style={{
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
                  </div>
                </div>
              </section>
            )}

            {/* Watchlist Grid */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {isWatchlistLoading
                    ? "Loading..."
                    : watchlistError
                      ? "Error"
                      : totalLists > 0
                        ? `${totalLists} watchlist${totalLists !== 1 ? "s" : ""}`
                        : "No watchlists yet"}
                </h2>
              </div>

              {/* Loading skeleton */}
              {isWatchlistLoading && <CardsSkeleton />}

              {/* Error */}
              {!isWatchlistLoading && watchlistError && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 py-16 text-center">
                  <p className="text-sm text-red-300">{watchlistError}</p>
                  <button
                    onClick={() => loadWatchlists()}
                    className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!isWatchlistLoading && !watchlistError && watchlists.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
                    <IconList className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      No watchlists yet
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Create your first collection to start organizing movies.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatePopupOpen(true)}
                    className="mt-2 flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                  >
                    <IconPlus className="h-4 w-4" />
                    Create your first watchlist
                  </button>
                </div>
              )}

              {/* Watchlist cards */}
              {!isWatchlistLoading && !watchlistError && watchlists.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {watchlists.map((watchlist) => (
                    <Link
                      key={watchlist.id}
                      href={`/watchlist/${watchlist.id}`}
                      className="group relative flex h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    >
                      {/* Left 1/3 — Poster image */}
                      <div className="relative w-1/3 shrink-0 overflow-hidden">
                        {watchlist.thumbnail ? (
                          <img
                            src={watchlist.thumbnail}
                            alt={watchlist.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-900/80">
                            <IconFilm className="h-8 w-8 text-zinc-700" />
                          </div>
                        )}
                        {/* Fade from image to card */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d0e13]" />
                      </div>

                      {/* Right 2/3 — Content */}
                      <div className="relative flex flex-1 flex-col justify-between py-4 pr-5 pl-2">
                        {/* Hover gradient accent */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-cyan-500/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-zinc-50">
                              {watchlist.title}
                            </h3>
                            {watchlist.description && (
                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                                {watchlist.description}
                              </p>
                            )}
                          </div>
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteWatchlist(watchlist.id);
                            }}
                            disabled={deletingId === watchlist.id}
                            className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-transparent text-zinc-600 opacity-0 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:opacity-50"
                            title="Delete watchlist"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="relative flex items-center gap-2 text-xs text-zinc-500">
                          <IconFilm className="h-3.5 w-3.5" />
                          <span>
                            {watchlist.totalItems}{" "}
                            {watchlist.totalItems === 1 ? "title" : "titles"}
                          </span>
                          <IconArrowRight className="ml-auto h-3.5 w-3.5 text-zinc-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* FAB — Create list */}
      {user && (
        <button
          type="button"
          onClick={() => setIsCreatePopupOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] transition hover:bg-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-100">
            <IconPlus className="h-5 w-5" />
          </span>
          Create list
        </button>
      )}

      {/* Create Watchlist Popup */}
      {isCreatePopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setIsCreatePopupOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Popup header with accent */}
            <div className="border-b border-zinc-800/70 bg-zinc-900/30 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                    Create Watchlist
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    New watchlist
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatePopupOpen(false)}
                  className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Popup form */}
            <form className="grid gap-4 p-8" onSubmit={handleCreateSubmit}>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">
                  Watchlist name
                </label>
                <input
                  name="title"
                  value={createForm.title}
                  onChange={handleCreateChange}
                  placeholder="e.g. Weekend Picks"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  placeholder="What's this list about?"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="h-11 rounded-lg bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? "Creating..." : "Create watchlist"}
              </button>
              {createError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
                  {createError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-sm transition-all ${
            toast.type === "error"
              ? "border-red-500/40 bg-red-950/80 text-red-200"
              : "border-emerald-500/40 bg-emerald-950/80 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}
    </div>
  );
}
