"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Watchlist", href: "/watchlist" },
    { label: "Likes", href: "/likes" },
    { label: "Profile", href: "/profile" },
];

function IconSearch(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </svg>
    );
}

export default function TopNav({
                                   active = "Dashboard",
                                   containerClassName = "max-w-7xl px-6 py-4",
                               }) {
    const { user } = useAuth();

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const isScrollingUp = currentScroll < lastScrollY.current;
            const shouldShow = currentScroll < 80 || isScrollingUp;

            setIsVisible(shouldShow);
            lastScrollY.current = currentScroll;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div>
            <div
                className={`fixed left-0 right-0 top-0 z-50 border-b border-zinc-800/70 bg-black/80 backdrop-blur transition-transform duration-300 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className={`mx-auto flex w-full flex-wrap items-center justify-between gap-4 ${containerClassName}`}>
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-lg font-semibold tracking-wide text-white">
                            WatchHub
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={
                                        link.label === active
                                            ? "text-zinc-100 hover:text-zinc-200"
                                            : "hover:text-zinc-200"
                                    }
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800">
                            <IconSearch className="h-4 w-4" />
                        </button>

                        <Link
                            href="/profile"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 text-sm font-semibold text-white"
                        >
                            {firstLetter}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}
