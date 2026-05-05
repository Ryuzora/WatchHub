'use client';

import Link from "next/link";

export default function SignupPage() {
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
            action="#"
            onSubmit={(event) => event.preventDefault()}
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
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
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
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
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
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-11 w-full rounded-md border border-zinc-700/80 bg-zinc-800 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
            >
              Create Account
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
