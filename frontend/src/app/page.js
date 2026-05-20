import React from "react";

const filters = ["All", "Watching", "Completed", "Plan to Watch"];

// Swap this function with a database/API call later.
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

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6.5 9.5a5.5 5.5 0 0111 0c0 4 1.5 5.5 2.5 6H4c1-0.5 2.5-2 2.5-6z" />
      <path d="M9.5 19a2.5 2.5 0 005 0" />
    </svg>
  );
}

function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function Home() {
  const movies = getWatchlist();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="text-lg font-semibold tracking-wide text-white">WatchLog</div>
            <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
              <span className="text-zinc-100">Dashboard</span>
              <span className="hover:text-zinc-200">Search</span>
              <span className="hover:text-zinc-200">Watchlist</span>
              <span className="hover:text-zinc-200">Profile</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300">
              <IconSearch className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300">
              <IconBell className="h-4 w-4" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500" />
          </div>
        </header>

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
          <article className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-zinc-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950">
              <IconPlus className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm">Add new title</p>
          </article>
        </section>
      </div>
    </div>
  );
}
