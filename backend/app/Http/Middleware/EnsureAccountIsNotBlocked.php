<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsNotBlocked
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $blockedAccount = $user?->blockedAccount()->first();

        if (! $blockedAccount) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $blockedAccount->message,
            ], 403);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->withErrors([
            'email' => $blockedAccount->message,
        ]);
    }
}
