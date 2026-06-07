import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Watchlist',
        href: '',
    },
];

interface Movie {
    id: number; // Storing the TMDB unique identifier
    title: string;
    release_year?: string | null;
    genre?: string | null;
}

interface Watchlist {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    created_at: string;
    movies?: Movie[];
}

interface WatchlistShowProps {
    watchlist: Watchlist;
}

export default function Dashboard({ watchlist }: WatchlistShowProps) {
    const movies = watchlist.movies || [];

    const handleRemoveMovie = (movieId: number) => {
        if (confirm('Are you sure you want to remove this movie from the watchlist?')) {
            router.delete(`/watchlists/${watchlist.id}/movies/${movieId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Watchlist - ${watchlist.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 lg:flex-row">
                
                <div className="border-sidebar-border/70 dark:border-sidebar-border w-full lg:w-1/3 rounded-xl border p-6 bg-background h-fit">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">Watchlist Metadata</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Detailed attributes of this collection.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Title</div>
                            <div className="col-span-2 text-sm font-semibold text-foreground">{watchlist.title}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Description</div>
                            <div className="col-span-2 text-sm text-muted-foreground break-words whitespace-pre-wrap">
                                {watchlist.description || 'No description provided.'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Total Content</div>
                            <div className="col-span-2 text-sm text-muted-foreground font-medium">
                                {movies.length} {movies.length === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Created At</div>
                            <div className="col-span-2 text-sm text-muted-foreground">
                                {new Date(watchlist.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border p-6 bg-background h-fit">
                    <div className="mb-4 border-b pb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">Movies Playlist (TMDB Linked)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Media data populated on-demand from our external API wrapper.
                            </p>
                        </div>
                    </div>

                    {movies.length === 0 ? (
                        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
                            No external movies registered inside this watchlist.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="grid grid-cols-12 gap-4 border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <div className="col-span-6">Title</div>
                                <div className="col-span-3">Genre</div>
                            </div>

                            <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                                {movies.map((movie) => (
                                    <div key={movie.id} className="grid grid-cols-12 gap-4 items-center py-3 text-sm">
                                        <div className="col-span-6 font-medium truncate flex items-center gap-2">
                                            <span className="truncate text-foreground">{movie.title}</span>
                                            {movie.release_year && (
                                                <span className="text-xs text-muted-foreground shrink-0">
                                                    ({movie.release_year})
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-3 truncate text-muted-foreground">
                                            {movie.genre || '—'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}