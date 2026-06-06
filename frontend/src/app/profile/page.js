"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthLoading, logout } = useAuth();

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login");
        }
    }, [user, isAuthLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (isAuthLoading) {
        return (
            <main className="min-h-screen bg-[#0b0b0f] text-white">
                <TopNav active="Profile" />

                <section className="mx-auto max-w-5xl px-6 pt-32">
                    <p className="text-zinc-400">Loading profile...</p>
                </section>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#0b0b0f] text-white">
            <TopNav active="Profile" />

            <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Profile
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold">
                        My Profile
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Your WatchHub account information.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 text-4xl font-semibold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="mt-5 text-center">
                            <h2 className="text-xl font-semibold">
                                {user.name}
                            </h2>

                            <p className="mt-1 text-sm text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                        <h2 className="text-xl font-semibold">
                            Account Information
                        </h2>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="text-sm text-zinc-500">
                                    Name
                                </label>

                                <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100">
                                    {user.name}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-zinc-500">
                                    Email
                                </label>

                                <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/likes"
                                className="rounded-md border border-zinc-700/80 bg-zinc-800 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
                            >
                                My Likes
                            </Link>

                            <Link
                                href="/watchlist"
                                className="rounded-md border border-zinc-700/80 bg-zinc-800 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
                            >
                                My Watchlist
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-md border border-red-900/60 bg-red-950/40 px-5 py-3 text-sm font-medium text-red-200 transition hover:bg-red-900/50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
