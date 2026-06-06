"use client";

import { useEffect, useState } from "react";

const getCookie = (name) => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }

    return null;
};

export default function AddWatchlistButton({ movieId }) {
    const [showModal, setShowModal] = useState(false);
    const [watchlists, setWatchlists] = useState([]);
    const [selectedWatchlistId, setSelectedWatchlistId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const loadWatchlists = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:8000/api/watchlists", {
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Gagal mengambil watchlist");
            }

            const result = await response.json();

            const items = Array.isArray(result)
                ? result
                : result.data || [];

            setWatchlists(items);
            setSelectedWatchlistId(items?.[0]?.id || "");

            const alreadyAdded = items.some((watchlist) => {
                const watchlistItems =
                    watchlist.items ||
                    watchlist.movies ||
                    watchlist.watchlist_items ||
                    [];

                return watchlistItems.some((item) => {
                    const tmdbId =
                        item.tmdb_movie_id ||
                        item.movie?.tmdb_movie_id ||
                        item.movie_id;

                    return Number(tmdbId) === Number(movieId);
                });
            });

            setIsAdded(alreadyAdded);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadWatchlists();
    }, [movieId]);

    const handleOpenModal = () => {
        if (isAdded) return;
        setShowModal(true);
    };

    const handleAddToWatchlist = async () => {
        if (!selectedWatchlistId) {
            alert("Pilih watchlist dulu");
            return;
        }

        try {
            setIsAdding(true);

            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: "include",
            });

            const xsrfToken = getCookie("XSRF-TOKEN");

            const response = await fetch(
                `http://localhost:8000/api/watchlists/${selectedWatchlistId}/items`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-XSRF-TOKEN": xsrfToken,
                    },
                    body: JSON.stringify({
                        tmdb_movie_id: movieId,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menambahkan film");
            }

            setIsAdded(true);
            setShowModal(false);
        } catch (error) {
            alert(error.message || "Gagal menambahkan film ke watchlist");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpenModal}
                disabled={isAdding}
                className={
                    isAdded
                        ? "h-11 min-w-[140px] rounded-md bg-zinc-200 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                        : "h-11 min-w-[140px] rounded-md border border-zinc-700/80 bg-zinc-800 px-5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:opacity-60"
                }
            >
                {isAdded ? "Added to Watchlist" : "Add to Watchlist"}
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-white">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Add to Watchlist
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-sm text-zinc-400 hover:text-white"
                            >
                                Close
                            </button>
                        </div>

                        {isLoading ? (
                            <p className="text-sm text-zinc-400">
                                Loading watchlists...
                            </p>
                        ) : watchlists.length === 0 ? (
                            <p className="text-sm text-zinc-400">
                                You dont have watchlist yet.
                            </p>
                        ) : (
                            <>
                                <label className="mb-2 block text-sm text-zinc-400">
                                    Choose watchlist
                                </label>

                                <select
                                    value={selectedWatchlistId}
                                    onChange={(e) => setSelectedWatchlistId(e.target.value)}
                                    className="mb-5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                                >
                                    {watchlists.map((watchlist) => (
                                        <option key={watchlist.id} value={watchlist.id}>
                                            {watchlist.title || watchlist.name || `Watchlist ${watchlist.id}`}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleAddToWatchlist}
                                    disabled={isAdding}
                                    className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-60"
                                >
                                    {isAdding ? "Adding..." : "Add Movie"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
