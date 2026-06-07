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
                
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 rounded-xl border p-6 bg-background h-fit">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">User Details</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administrative overview for this account instance.
                            </p>
                        </div>
                        <Link
                            href="/users"
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Back to List
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">User ID</div>
                            <div className="col-span-2 text-sm font-mono">{user.id}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                            <div className="col-span-2 text-sm font-semibold">{user.name}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Email Address</div>
                            <div className="col-span-2 text-sm text-muted-foreground">{user.email}</div>
                        </div>

                        {user.username && (
                            <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                <div className="text-sm font-medium text-muted-foreground">Username</div>
                                <div className="col-span-2 text-sm font-mono text-muted-foreground">@{user.username}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pb-4">
                            <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                            <div className="col-span-2 text-sm text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border w-full md:w-96 rounded-xl border p-6 bg-background h-fit">
                    <div className="mb-4 border-b pb-4">
                        <h3 className="text-lg font-semibold tracking-tight">Watchlists</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Monitored feeds belonging to this user ({watchlists.length})
                        </p>
                    </div>

                    {watchlists.length === 0 ? (
                        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
                            No watchlists found for this user.
                        </div>
                    ) : (
                        <div className="divide-y divide-border max-h-[400px] overflow-y-auto pr-2">
                            {watchlists.map((watchlist) => (
                                <div key={watchlist.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate">
                                            <Link 
                                                href={route('watchlist.show', { watchlist: watchlist.id })}
                                                className="text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                                            >
                                                {watchlist.title}
                                            </Link>
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {watchlist.description}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Created: {new Date(watchlist.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteWatchlist(watchlist.id)}
                                        className="inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
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