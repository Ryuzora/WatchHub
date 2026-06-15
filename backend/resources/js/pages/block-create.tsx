import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blocked Accounts',
        href: '/users',
    },
    {
        title: 'Block User',
        href: '',
    },
];

export default function Create() {
    // 1. Initialize useForm tracking the email string
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        type: 'temporary' as 'temporary' | 'permanent',
        message: '',
    });

    // 2. Submit form via a POST request
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('block.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Block User Account" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border max-w-2xl rounded-xl border p-6 bg-background">
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold tracking-tight">Restrict User Account</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Enter a user's registered email address to apply an administrative restriction.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Search Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                User Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="e.g., alex@example.com"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {/* Display backend validation error if the email doesn't exist */}
                            {errors.email && (
                                <p className="text-xs font-medium text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Block Type Selection */}
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

                        {/* Block Message/Reason */}
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

                        {/* Action Buttons */}
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
                                className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground shadow transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Block Account'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}