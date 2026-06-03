"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    checkMovieLike,
    likeMovie,
    unlikeMovie,
} from "@/services/likeService";

export default function LikeButton({ tmdbMovieId }) {
    const { user, isAuthLoading } = useAuth();

    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingLike, setCheckingLike] = useState(true);

    useEffect(() => {
        const loadLikeStatus = async () => {
            if (isAuthLoading) {
                return;
            }

            if (!user) {
                setLiked(false);
                setCheckingLike(false);
                return;
            }

            const isLiked = await checkMovieLike(tmdbMovieId);
            setLiked(isLiked);
            setCheckingLike(false);
        };

        void loadLikeStatus();
    }, [tmdbMovieId, user, isAuthLoading]);

    const handleToggleLike = async () => {
        if (!user || loading) {
            return;
        }

        setLoading(true);

        try {
            if (liked) {
                const result = await unlikeMovie(tmdbMovieId);

                if (result) {
                    setLiked(false);
                }
            } else {
                const result = await likeMovie(tmdbMovieId);

                if (result) {
                    setLiked(true);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (isAuthLoading || checkingLike) {
        return (
            <button
                type="button"
                disabled
                className="h-11 min-w-[140px] rounded-md border border-zinc-700/80 bg-zinc-800 px-5 text-sm font-medium text-zinc-400"
            >
                Checking...
            </button>
        );
    }

    if (!user) {
        return (
            <Link
                href={`/login?redirect=/detail/${tmdbMovieId}`}
                className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-md border border-zinc-700/80 bg-zinc-800 px-5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
            >
                Sign in to Like
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={handleToggleLike}
            disabled={loading}
            className={
                liked
                    ? "h-11 min-w-[140px] rounded-md bg-zinc-200 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-60"
                    : "h-11 min-w-[140px] rounded-md border border-zinc-700/80 bg-zinc-800 px-5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:opacity-60"
            }
        >
            {loading ? "Saving..." : liked ? "Liked" : "Like"}
        </button>
    );
}
