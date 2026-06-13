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
];

interface Watchlist {
    id: number;
    user_id: number;
    title: string;
    description: string;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
    created_at: string;
}

interface UserShowProps {
    user: User;
    watchlists: Watchlist[];
}

export default function Dashboard({ user, watchlists }: UserShowProps) {
    const handleDeleteWatchlist = (id: number) => {
        if (confirm('Are you sure you want to delete this watchlist?')) {
            router.delete(`/watchlist/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Profile - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:flex-row">
                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background h-fit flex-1 rounded-xl border p-6">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">User Details</h2>
                            <p className="text-muted-foreground mt-1 text-sm">Administrative overview for this account instance.</p>
                        </div>
                        <Link
                            href="/users"
                            className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1"
                        >
                            Back to List
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">User ID</div>
                            <div className="col-span-2 font-mono text-sm">{user.id}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Full Name</div>
                            <div className="col-span-2 text-sm font-semibold">{user.name}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Email Address</div>
                            <div className="text-muted-foreground col-span-2 text-sm">{user.email}</div>
                        </div>

                        {user.username && (
                            <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                <div className="text-muted-foreground text-sm font-medium">Username</div>
                                <div className="text-muted-foreground col-span-2 font-mono text-sm">@{user.username}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pb-4">
                            <div className="text-muted-foreground text-sm font-medium">Joined Date</div>
                            <div className="text-muted-foreground col-span-2 text-sm">
                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background h-fit w-full rounded-xl border p-6 md:w-96">
                    <div className="mb-4 border-b pb-4">
                        <h3 className="text-lg font-semibold tracking-tight">Watchlists</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Monitored feeds belonging to this user ({watchlists.length})</p>
                    </div>

                    {watchlists.length === 0 ? (
                        <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-sm">
                            No watchlists found for this user.
                        </div>
                    ) : (
                        <div className="divide-border max-h-[400px] divide-y overflow-y-auto pr-2">
                            {watchlists.map((watchlist) => (
                                <div key={watchlist.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <div className="truncate text-sm font-medium">
                                            <Link
                                                href={route('watchlist.show', { watchlist: watchlist.id })}
                                                className="text-foreground hover:text-primary focus-visible:ring-ring rounded hover:underline focus-visible:outline-none focus-visible:ring-1"
                                            >
                                                {watchlist.title}
                                            </Link>
                                        </div>
                                        <div className="text-muted-foreground truncate text-xs">{watchlist.description}</div>
                                        <div className="text-muted-foreground text-xs">
                                            Created: {new Date(watchlist.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteWatchlist(watchlist.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-ring inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
