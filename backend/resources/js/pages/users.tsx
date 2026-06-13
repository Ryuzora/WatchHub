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
                                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1"
                            >
                                Block Account
                            </Link>
                        </div>

                        {accounts.length === 0 ? (
                            <div className="text-muted-foreground flex h-40 items-center justify-center">No blocked accounts found.</div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <div className="text-muted-foreground grid grid-cols-12 gap-4 border-b pb-2 text-xs font-semibold uppercase tracking-wider">
                                    <div className="col-span-3">Name</div>
                                    <div className="col-span-4">Email</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-3 text-right">Actions</div>
                                </div>

                                <div className="divide-border divide-y">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="grid grid-cols-12 items-center gap-4 py-3 text-sm">
                                            <div className="col-span-3 truncate font-medium">
                                                <Link
                                                    href={route('user.show', { user: account.user.id })}
                                                    className="hover:text-primary focus-visible:ring-ring rounded hover:underline focus-visible:outline-none focus-visible:ring-1"
                                                >
                                                    {account.user.name}
                                                </Link>
                                            </div>
                                            <div className="text-muted-foreground col-span-4 truncate">{account.user.email}</div>
                                            <div className="col-span-2">
                                                <span className="bg-destructive/10 text-destructive inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium">
                                                    {account.type}
                                                </span>
                                            </div>
                                            <div className="col-span-3 flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdate(account.id)}
                                                    className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(account.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1"
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
                        <p className="text-muted-foreground text-sm">
                            Showing page <span className="text-foreground font-medium">{current_page}</span> of{' '}
                            <span className="text-foreground font-medium">{last_page}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 ${!link.url ? 'pointer-events-none opacity-40' : ''} ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground shadow'
                                            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
                                    } `}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
