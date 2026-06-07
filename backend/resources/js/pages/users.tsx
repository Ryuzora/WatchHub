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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface BlockedAccount {
    id: number;
    user: User;
    type: string;
}

interface DashboardProps {
    users: PaginatedData<BlockedAccount>;
}

export default function Dashboard({ users }: DashboardProps) {
    const { data: accounts, links, current_page, last_page } = users;

    const handleUpdate = (id: number) => {
        router.get(route('block.edit', { block: id }));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to unblock this account?')) {
            router.delete(`/block/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] flex-1 flex-col justify-between rounded-xl border p-6 md:min-h-min">
                    
                    <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight">Blocked Accounts</h2>
                            <Link
                                href={route('block.create')}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Block Account
                            </Link>
                        </div>
                        
                        {accounts.length === 0 ? (
                            <div className="flex h-40 items-center justify-center text-muted-foreground">
                                No blocked accounts found.
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <div className="grid grid-cols-12 gap-4 border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-4">Email</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-3 text-right">Actions</div>
                                </div>

                                <div className="divide-y divide-border">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="grid grid-cols-12 gap-4 items-center py-3 text-sm">
                                            <div className="col-span-3 font-medium truncate">
                                                <Link 
                                                    href={route('user.show', { user: account.user.id })}
                                                    className="hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                                                >
                                                    {account.user.name}
                                                </Link>
                                            </div>
                                            <div className="col-span-4 truncate text-muted-foreground">{account.user.email}</div>
                                            <div className="col-span-2">
                                                <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                                                    {account.type}
                                                </span>
                                            </div>
                                            <div className="col-span-3 flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdate(account.id)}
                                                    className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(account.id)}
                                                    className="inline-flex h-8 items-center justify-center rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    Unblock
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Showing page <span className="font-medium text-foreground">{current_page}</span> of{' '}
                            <span className="font-medium text-foreground">{last_page}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                                        ${!link.url ? 'pointer-events-none opacity-40' : ''}
                                        ${link.active 
                                            ? 'bg-primary text-primary-foreground shadow' 
                                            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                        }
                                    `}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}