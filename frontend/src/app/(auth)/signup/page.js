"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { registerUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
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
      await registerUser(formState);
      await refreshUser();
      router.push("/watchlog");
    } catch (error) {
      setErrorMessage(error?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-200">
          WatchHub
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign up to start exploring WatchHub
        </p>

        <section className="mt-10 rounded-md border border-zinc-700/70 bg-zinc-900/40 p-7 text-left shadow-2xl shadow-black/30">
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label className="text-sm text-zinc-400" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Melon stecu"
                value={formState.name}
                onChange={handleChange}
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="melon@stecu.com"
                value={formState.email}
                onChange={handleChange}
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400" htmlFor="passwordConfirmation">
                Confirm password
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                placeholder="••••••••"
                value={formState.passwordConfirmation}
                onChange={handleChange}
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
                required
              />
            </div>

            {errorMessage && (
              <p className="rounded border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-11 w-full rounded-md border border-zinc-700/80 bg-zinc-800 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </section>

        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-200 hover:text-white">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
