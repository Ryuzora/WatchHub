"use client";

import React from "react";
import { useRouter } from "next/navigation";

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

        <div className="mt-5 flex flex-wrap gap-2">
          {popupCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedCategory === category
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
            <h4 className="text-sm font-semibold text-white">{selectedCategory} picks</h4>
            <span className="text-xs text-zinc-400">{popupMovies.length} titles</span>
          </div>
          {isPopupLoading && (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-400">
              Loading movies...
            </div>
          )}
          {!isPopupLoading && popupError && (
            <div className="mt-4 rounded-xl border border-dashed border-red-500/60 p-6 text-center text-xs text-red-200">
              {popupError}
            </div>
          )}
          {!isPopupLoading && !popupError && popupMovies.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-400">
              No movies available yet.
            </div>
          )}
          {!isPopupLoading && !popupError && popupMovies.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {popupMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => router.push(`/detail/${movie.id}`)}
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
