"use client";

import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import WatchlogPopup from "../components/WatchlogPopup";

const filters = ["All", "Watching", "Completed", "Plan to Watch"];

const popupCategories = ["Now Playing", "Popular", "Top Rated", "Upcoming"];

const categoryEndpoints = {
  "Now Playing": "now-playing",
  Popular: "popular",
  "Top Rated": "top-rated",
  Upcoming: "upcoming",
};

const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

const popupLists = [
  { id: "list-1", title: "Trending This Week", count: 12, description: "Popular picks across genres." },
  { id: "list-2", title: "Award Winners", count: 8, description: "Critically acclaimed favorites." },
  { id: "list-3", title: "Hidden Gems", count: 15, description: "Underrated stories worth a watch." },
  { id: "list-4", title: "Family Night", count: 6, description: "Feel-good and all-ages picks." },
];

function getWatchlist() {
  return [
    {
      id: "movie-1",
      title: "The Final Frame",
      director: "C. Saramadewa",
      year: 2020,
      status: "Watching",
      rating: 8.8,
      duration: "2h 8m",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "movie-2",
      title: "Concrete Dreams",
      director: "M. Kusanagi",
      year: 2018,
      status: "Completed",
      rating: 8.4,
      duration: "1h 54m",
      image:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "movie-3",
      title: "Celluloid Memory",
      director: "A. Hartwell",
      year: 2022,
      status: "Watching",
      rating: 9.1,
      duration: "2h 20m",
      image:
        "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "movie-4",
      title: "The Void Protocol",
      director: "V. Yamada",
      year: 2019,
      status: "Watching",
      rating: 8.2,
      duration: "1h 46m",
      image:
        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&auto=format&fit=crop",
    },
  ];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function getReleaseYear(dateString) {
  if (!dateString) {
    return "—";
  }

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
    rating: item.vote_average ? Number(item.vote_average).toFixed(1) : item.rating ?? "—",
    image:
      item.image ||
      (item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null) ||
      (item.backdrop_path ? `${imageBaseUrl}${item.backdrop_path}` : null),
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

export default function Watchlog() {
  const movies = getWatchlist();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(popupCategories[0]);
  const [popupMovies, setPopupMovies] = useState([]);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState("");

  useEffect(() => {
    if (!isPopupOpen) {
      return undefined;
    }

    const endpoint = categoryEndpoints[selectedCategory];
    if (!endpoint) {
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadPopupMovies = async () => {
      setIsPopupLoading(true);
      setPopupError("");

      try {
        const response = await fetch(buildApiUrl(`/api/movies/${endpoint}`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = await response.json();
        const normalized = normalizePopupMovies(payload);

        if (isActive) {
          setPopupMovies(normalized);
        }
      } catch (error) {
        if (!controller.signal.aborted && isActive) {
          setPopupError("Failed to load movies.");
          setPopupMovies([]);
        }
      } finally {
        if (isActive) {
          setIsPopupLoading(false);
        }
      }
    };

    loadPopupMovies();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isPopupOpen, selectedCategory]);

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
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-100">
                  {movie.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="text-base font-semibold text-white">{movie.title}</h2>
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
        </section>
      </div>

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

      <WatchlogPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        popupCategories={popupCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        popupMovies={popupMovies}
        isPopupLoading={isPopupLoading}
        popupError={popupError}
        popupLists={popupLists}
      />
    </div>
  );
}
