"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchMovies } from "@/services/movieService";

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

function getReleaseYear(dateString) {
  if (!dateString) return "—";
  const year = Number(dateString.slice(0, 4));
  return Number.isNaN(year) ? "—" : year;
}

function normalizeSearchMovies(movies) {
  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title ?? movie.name ?? "Untitled",
    year: getReleaseYear(movie.release_date ?? movie.first_air_date),
    rating: movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—",
    image:
      (movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : null) ||
      (movie.backdrop_path ? `${imageBaseUrl}${movie.backdrop_path}` : null),
  }));
}

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function WatchlogPopup({
  isOpen,
  onClose,
  popupCategories,
  selectedCategory,
  onSelectCategory,
  popupMovies,
  isPopupLoading,
  popupError,
  onAddMovie,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const trimmedSearchQuery = searchQuery.trim();
  const isSearchingMode = trimmedSearchQuery.length >= 2;
  const visibleMovies = isSearchingMode ? searchResults : popupMovies;
  const isVisibleLoading = isSearchingMode ? isSearchLoading : isPopupLoading;
  const visibleError = isSearchingMode ? searchError : popupError;
  const sectionTitle = isSearchingMode
    ? `Search results for "${trimmedSearchQuery}"`
    : `${selectedCategory} picks`;

  useEffect(() => {
    if (!isOpen || trimmedSearchQuery.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearchLoading(true);
      setSearchError("");

      try {
        const movies = await searchMovies(trimmedSearchQuery);
        setSearchResults(normalizeSearchMovies(movies));
      } catch (error) {
        setSearchResults([]);
        setSearchError("Failed to search movies.");
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, trimmedSearchQuery]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setSearchError("");
      setIsSearchLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
    setIsSearchLoading(false);
    onSelectCategory(category);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] h-full w-full max-w-7xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] scrollbar-dark"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Add to Watchlist</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Select a movie to add</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300 transition hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="relative mt-6">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search movies to add..."
            className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-12 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700/40"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {popupCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                !isSearchingMode && selectedCategory === category
                  ? "bg-zinc-100 text-zinc-900"
                  : "border border-zinc-800 text-zinc-300 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">{sectionTitle}</h4>
            <span className="text-xs text-zinc-400">{visibleMovies.length} titles</span>
          </div>
          {isVisibleLoading && (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-400">
              Loading movies...
            </div>
          )}
          {!isVisibleLoading && visibleError && (
            <div className="mt-4 rounded-xl border border-dashed border-red-500/60 p-6 text-center text-xs text-red-200">
              {visibleError}
            </div>
          )}
          {!isVisibleLoading && !visibleError && visibleMovies.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-400">
              {isSearchingMode ? "No movies found." : "No movies available yet."}
            </div>
          )}
          {!isVisibleLoading && !visibleError && visibleMovies.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {visibleMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => router.push(`/detail/${movie.id}?from=${encodeURIComponent(window.location.pathname)}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 transition hover:border-zinc-600"
                >
                  {movie.image ? (
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="aspect-2/3 w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-2/3 w-full items-center justify-center bg-zinc-900/50 text-xs text-zinc-400">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white">{movie.title}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-zinc-300">
                      <span>{movie.year}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-zinc-200">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddMovie(movie.id);
                      }}
                      className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-white"
                    >
                      <IconPlus className="h-4 w-4" />
                      Add to Watchlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
