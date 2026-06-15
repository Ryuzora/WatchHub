import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface BlockedAccount {
    id: number;
    user_id: number;
    type: 'temporary' | 'permanent';
    message: string;
    user: User;
}

interface EditProps {
    account: BlockedAccount;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blocked Accounts',
        href: '/users',
    },
    {
        title: 'Edit',
        href: '',
    },
];

export default function Edit({ account }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        type: account.type || 'temporary',
        message: account.message || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        put(route('block.update', { block: account.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Block - ${account.user.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border max-w-2xl rounded-xl border p-6 bg-background">
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold tracking-tight">Modify Restriction Settings</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Updating restrictions for <span className="font-semibold text-foreground">{account.user.name}</span> ({account.user.email})
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="type" className="text-sm font-medium leading-none">
                                Restriction Type
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value as 'temporary' | 'permanent')}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="temporary">Temporary</option>
                                <option value="permanent">Permanent</option>
                            </select>
                            {errors.type && (
                                <p className="text-xs font-medium text-destructive">{errors.type}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-sm font-medium leading-none">
                                Reason / Message
                            </label>
                            <textarea
                                id="message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={4}
                                placeholder="Provide a reason for the account block..."
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {errors.message && (
                                <p className="text-xs font-medium text-destructive">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <a
                                href="/users"
                                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                {processing ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}