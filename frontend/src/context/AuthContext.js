"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";

function buildApiUrl(path) {
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function getCookie(name) {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }

    return null;
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        setIsAuthLoading(true);

        try {
            const response = await fetch(buildApiUrl("/api/user"), {
                method: "GET",
                credentials: "include",
                cache: "no-store",
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return userData;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            setUser(null);
            return null;
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(buildApiUrl("/sanctum/csrf-cookie"), {
                credentials: "include",
            });

            const xsrfToken = getCookie("XSRF-TOKEN");

            await fetch(buildApiUrl("/logout"), {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": xsrfToken || "",
                },
            });

            setUser(null);
        } catch (error) {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        refreshUser();

        const handlePageShow = (event) => {
            if (event.persisted) {
                refreshUser();
            }
        };

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [refreshUser]);

    const value = {
        user,
        isAuthLoading,
        setUser,
        refreshUser,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
