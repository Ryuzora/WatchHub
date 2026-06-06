import Link from "next/link";
import TopNav from "../../components/TopNav";
import ReviewSection from "./ReviewSection";
import LikeButton from "./LikeButton";
import AddWatchlistButton from '@/app/detail/[id]/AddWatchlistButton';
import { getMovieDetail, getMovieReviews } from '@/services/movieService';

export default async function DetailPage({ params }) {
    const { id } = await params;

    const movie = await getMovieDetail(id);
    const initialReviews = await getMovieReviews(id);
    const reviewCount = initialReviews.length;

    const userRating =
        reviewCount > 0
            ? (
                initialReviews.reduce((total, review) => total + Number(review.rating), 0) /
                reviewCount
            ).toFixed(1)
            : null;

    if (!movie) {
        return (
            <main className="min-h-screen bg-[#0b0b0f] text-zinc-100">
                <TopNav active="Dashboard" />

                <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-10">
                    <div className="w-full rounded-md border border-zinc-700/70 bg-zinc-900/40 p-7 shadow-2xl shadow-black/30">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-200">
                            Film not found.
                        </h1>

                        <p className="mt-3 text-sm text-zinc-400">
                            Failed to load.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-zinc-200 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                        >
                            Back
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return (
        <main className="min-h-screen bg-[#0b0b0f] text-zinc-100">
            <TopNav active="Dashboard" />

            <section className="mx-auto max-w-7xl px-6 pb-16 pt-10">
                <Link
                    href="/"
                    className="mb-6 inline-block text-sm text-zinc-400 transition hover:text-zinc-200"
                >
                    ← Back
                </Link>

                <div className="w-full overflow-hidden rounded-md border border-zinc-700/70 bg-zinc-900/40 shadow-2xl shadow-black/30">
                    {backdropUrl && (
                        <div className="relative h-56 w-full overflow-hidden border-b border-zinc-700/70 md:h-80">
                            <img
                                src={backdropUrl}
                                alt={movie.title}
                                className="h-full w-full object-cover opacity-70"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/50 to-transparent" />
                        </div>
                    )}

                    <div className="grid gap-8 p-7 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">
                        <div>
                            <div className="overflow-hidden rounded-md border border-zinc-700 bg-zinc-900/80">
                                {posterUrl ? (
                                    <img
                                        src={posterUrl}
                                        alt={movie.title}
                                        className="w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-[2/3] items-center justify-center text-sm text-zinc-500">
                                        No Poster
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-200 md:text-5xl">
                                {movie.title}
                            </h1>

                            {movie.tagline && (
                                <p className="mt-3 text-sm italic text-zinc-400">
                                    “{movie.tagline}”
                                </p>
                            )}

                            <div className="mt-6 flex flex-wrap gap-2">
                                {movie.release_date && (
                                    <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300">
                                        {movie.release_date.slice(0, 4)}
                                    </span>
                                )}

                                {movie.runtime && (
                                    <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300">
                                        {movie.runtime} minutes
                                    </span>
                                )}

                                {movie.vote_average && (
                                    <span className="rounded-md border border-zinc-700 bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-900">
                                        Rating {movie.vote_average.toFixed(1)}
                                    </span>
                                )}

                                <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300">
                                    {userRating
                                        ? `User Rating ${userRating} / ${reviewCount} review${reviewCount > 1 ? "s" : ""}`
                                        : "-"}
                                </span>

                                {movie.status && (
                                    <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-sm text-zinc-300">
                                        {movie.status}
                                    </span>
                                )}
                            </div>

                            {movie.genres?.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="rounded-md border border-zinc-700/80 px-3 py-1 text-sm text-zinc-400"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold tracking-tight text-zinc-200">
                                    Overview
                                </h2>

                                <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-400">
                                    {movie.overview || "Overview not available."}
                                </p>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4">
                                    <p className="text-sm text-zinc-500">
                                        Original Language
                                    </p>
                                    <p className="mt-1 text-sm font-medium uppercase text-zinc-200">
                                        {movie.original_language || "-"}
                                    </p>
                                </div>

                                <div className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4">
                                    <p className="text-sm text-zinc-500">
                                        Popularity
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">
                                        {movie.popularity
                                            ? movie.popularity.toFixed(1)
                                            : "-"}
                                    </p>
                                </div>

                                <div className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4">
                                    <p className="text-sm text-zinc-500">
                                        Budget
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">
                                        {movie.budget
                                            ? `$${movie.budget.toLocaleString()}`
                                            : "-"}
                                    </p>
                                </div>

                                <div className="rounded-md border border-zinc-700/70 bg-zinc-900/60 p-4">
                                    <p className="text-sm text-zinc-500">
                                        Revenue
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-zinc-200">
                                        {movie.revenue
                                            ? `$${movie.revenue.toLocaleString()}`
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <AddWatchlistButton movieId={movie.id} />
                                <LikeButton tmdbMovieId={id} />
                            </div>

                            <ReviewSection tmdbMovieId={id} initialReviews={initialReviews} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
