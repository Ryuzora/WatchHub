import Link from "next/link";

export default function LoginPage() {
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

          <form className="mt-7 space-y-4" action="#">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500"
            />

            <a href="#" className="block text-sm text-zinc-400 hover:text-zinc-200 transition">
              Forgot password?
            </a>

            <button
              type="submit"
              className="h-12 w-full bg-zinc-200 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Sign In
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
