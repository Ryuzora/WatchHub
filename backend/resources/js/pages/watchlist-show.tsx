import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Watchlist - ${watchlist.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 lg:flex-row">
                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background h-fit w-full rounded-xl border p-6 lg:w-1/3">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">Watchlist Metadata</h2>
                            <p className="text-muted-foreground mt-1 text-sm">Detailed attributes of this collection.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Title</div>
                            <div className="text-foreground col-span-2 text-sm font-semibold">{watchlist.title}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Description</div>
                            <div className="text-muted-foreground col-span-2 whitespace-pre-wrap break-words text-sm">
                                {watchlist.description || 'No description provided.'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Total Content</div>
                            <div className="text-muted-foreground col-span-2 text-sm font-medium">
                                {movies.length} {movies.length === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Created At</div>
                            <div className="text-muted-foreground col-span-2 text-sm">
                                {new Date(watchlist.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background h-fit flex-1 rounded-xl border p-6">
                    <div className="mb-4 flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">Movies Playlist (TMDB Linked)</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Media data populated on-demand from our external API wrapper.</p>
                        </div>
                    </div>

                    {movies.length === 0 ? (
                        <div className="text-muted-foreground flex h-40 items-center justify-center rounded-lg border border-dashed text-sm">
                            No external movies registered inside this watchlist.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="text-muted-foreground grid grid-cols-12 gap-4 border-b pb-2 text-xs font-semibold uppercase tracking-wider">
                                <div className="col-span-6">Title</div>
                                <div className="col-span-3">Genre</div>
                            </div>

                            <div className="divide-border max-h-[500px] divide-y overflow-y-auto">
                                {movies.map((movie) => (
                                    <div key={movie.id} className="grid grid-cols-12 items-center gap-4 py-3 text-sm">
                                        <div className="col-span-6 flex items-center gap-2 truncate font-medium">
                                            <span className="text-foreground truncate">{movie.title}</span>
                                            {movie.release_year && (
                                                <span className="text-muted-foreground shrink-0 text-xs">({movie.release_year})</span>
                                            )}
                                        </div>
                                        <div className="text-muted-foreground col-span-3 truncate">{movie.genre || '—'}</div>
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
