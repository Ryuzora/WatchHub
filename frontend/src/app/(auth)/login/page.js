"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { loginUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { refreshUser } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await loginUser(formState);
      const loggedInUser = await refreshUser();

      if (redirectTo) {
        router.push(redirectTo);
      } else if (loggedInUser?.role === "admin") {
        window.location.href = `${backendBaseUrl}/users`;
      } else {
        router.push("/");
      }
    } catch (error) {
      setErrorMessage(error?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-zinc-200">
          WatchHub
        </h1>

        <section className="mt-10 rounded-md border border-zinc-700/70 bg-zinc-900/40 p-7 shadow-2xl shadow-black/30">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in to access WatchHub
            </p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formState.email}
              onChange={handleChange}
              className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formState.password}
              onChange={handleChange}
              className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500"
              required
            />

            {errorMessage && (
              <p className="rounded border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-zinc-200 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-zinc-200 hover:text-white">
              Sign Up
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
