"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    createMovieReview,
    getMovieReviews,
} from "../../../services/movieService";

function IconLock(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export default function ReviewSection({ tmdbMovieId, initialReviews = [] }) {
    const { user, isAuthLoading } = useAuth();

    const [reviews, setReviews] = useState(initialReviews);
    const [rating, setRating] = useState(10);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const refreshReviews = async () => {
        const data = await getMovieReviews(tmdbMovieId);
        setReviews(data);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            return;
        }

        setLoading(true);

        try {
            const result = await createMovieReview(tmdbMovieId, {
                rating,
                comment,
            });

            if (result) {
                setComment("");
                setRating(10);
                await refreshReviews();
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mt-10 border-t border-zinc-700/70 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-200">
                Rating & Reviews
            </h2>

            {isAuthLoading && (
                <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center">
                    <p className="text-sm text-zinc-400">
                        Checking login status...
                    </p>
                </div>
            )}

            {!isAuthLoading && !user && (
                <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300">
                        <IconLock className="h-7 w-7" />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold text-zinc-100">
                        Sign in required
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
                        You can read reviews without signing in, but you need to sign in first to submit a rating and comment.
                    </p>

                    <Link
                        href={`/login?redirect=/detail/${tmdbMovieId}`}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-100 px-7 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                    >
                        Go to Login →
                    </Link>
                </div>
            )}

            {!isAuthLoading && user && (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4">
                        <p className="text-sm text-zinc-400">
                            Reviewing as{" "}
                            <span className="font-medium text-zinc-200">
                                {user.name}
                            </span>
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Rating
                        </label>

                        <select
                            value={rating}
                            onChange={(event) =>
                                setRating(Number(event.target.value))
                            }
                            className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
                        >
                            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                            Comment
                        </label>

                        <textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="Write your comment..."
                            className="min-h-28 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 rounded-md bg-zinc-200 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Submit Review"}
                    </button>
                </form>
            )}

            <div className="mt-8 space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                        No reviews yet for this movie.
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium text-zinc-200">
                                    {review.user?.name || "User"}
                                </p>

                                <p className="text-sm text-zinc-300">
                                    Rating {review.rating}/10
                                </p>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                                {review.comment || "-"}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
