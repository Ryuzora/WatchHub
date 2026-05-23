import React from "react";
import TopNav from "./components/TopNav";

function getContinueWatching() {
    return {
        id: "continue-1",
        title: "Dune: Part Two",
        director: "Denis Villeneuve",
        year: 2024,
        duration: "2h 46m",
        image:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    };
}

function getRecentlyAdded() {
    return [
        {
            id: "recent-1",
            title: "Oppenheimer",
            year: 2021,
            image:
                "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "recent-2",
            title: "The Zone of Interest",
            year: 2023,
            tag: "SEEN",
            image:
                "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "recent-3",
            title: "Anatomy of a Fall",
            year: 2021,
            image:
                "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "recent-4",
            title: "Killers of the Flower Moon",
            year: 2021,
            image:
                "https://images.unsplash.com/photo-1512070679280-1b88f38c2dba?q=80&w=800&auto=format&fit=crop",
        },
    ];
}

function getTrendingThisWeek() {
    return [
        {
            id: "trending-1",
            title: "Poor Things",
            director: "Yorgos Lanthimos",
            year: 2023,
            rank: "#1 TRENDING",
            isFeature: true,
            image:
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
            description:
                "The incredible tale and fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
        },
        {
            id: "trending-2",
            title: "Past Lives",
            year: 2023,
            rank: "#2 TRENDING",
            image:
                "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "trending-3",
            title: "The Holdovers",
            year: 2023,
            rank: "#3 TRENDING",
            image:
                "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=800&auto=format&fit=crop",
        },
    ];
}

function IconPlay(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function IconArrow(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <path d="M13 17l5-5m0 0l-5-5m5 5H6" />
        </svg>
    );
}

export default function Home() {
    const latestWatch = getContinueWatching();
    const recentlyAdded = getRecentlyAdded();
    const trending = getTrendingThisWeek();

    return (
        <div className="min-h-screen bg-black text-zinc-100">
            <div className="mx-auto w-full max-w-7xl flex-col gap-8 px-6 py-6">
                <TopNav active="Dashboard" />

                {/* Latest Watching Section */}
                <section className="mb-12">
                    <h2 className="mb-6 text-xl font-semibold text-white">Latest Watch</h2>
                    <div className="grid gap-6 lg:grid-cols-2 border border-gray-300 rounded-2xl min-h-150">
                        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                            <img
                                src={latestWatch.image}
                                alt={latestWatch.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                        </div>
                        <div className="flex flex-col justify-center gap-6">
                            <h3 className="text-4xl font-semibold text-white">{latestWatch.title}</h3>
                            <button className="flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-2 font-semibold text-black transition hover:bg-zinc-200">
                                <IconPlay className="h-4 w-4" />
                                RESUME
                            </button>
                        </div>
                    </div>
                </section>

                {/* Recently Added Section */}
                <section className="mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Recently Added to Watchlist</h2>
                        <a href="#" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200">
                            VIEW ARCHIVE <IconArrow className="h-3 w-3" />
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 lg:grid-cols-5">
                        {recentlyAdded.map((movie) => (
                            <div
                                key={movie.id}
                                className="group relative shrink-0 overflow-hidden rounded-xl"
                            >
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="aspect-2/3 w-full object-cover transition group-hover:scale-105"
                                />
                                {movie.tag && (
                                    <span className="absolute left-3 top-3 rounded-sm bg-zinc-950/90 px-2 py-1 text-xs font-medium text-zinc-100">
                    {movie.tag}
                  </span>
                                )}
                                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                                    <p className="text-sm font-semibold text-white">{movie.title}</p>
                                    <p className="text-xs text-zinc-400">{movie.year}</p>
                                </div>
                            </div>
                        ))}
                        <div className="shrink-0">
                            <button className="flex aspect-2/3 w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 text-center text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-300">
                                Discover More
                            </button>
                        </div>
                    </div>
                </section>

                {/* Trending This Week Section */}
                <section>
                    <h2 className="mb-6 text-xl font-semibold text-white">Trending This Week</h2>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Trending Feature */}
                        <div className="lg:col-span-2">
                            <div className="relative h-96 w-full overflow-hidden rounded-2xl lg:h-full">
                                <img
                                    src={trending[0].image}
                                    alt={trending[0].title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    {trending[0].rank}
                  </span>
                                    <h3 className="mb-3 text-4xl font-semibold text-white">{trending[0].title}</h3>
                                    <p className="mb-6 max-w-md text-sm text-zinc-300">{trending[0].description}</p>
                                    <button className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 font-semibold text-black transition hover:bg-zinc-200">
                                        <IconPlay className="h-4 w-4" />
                                        Watch Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trending List */}
                        <div className="flex flex-col gap-4">
                            {trending.slice(1).map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative h-40 w-full overflow-hidden rounded-2xl"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xs font-medium text-zinc-400">
                      {item.rank}
                    </span>
                                        <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                        <p className="text-xs text-zinc-400">{item.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
