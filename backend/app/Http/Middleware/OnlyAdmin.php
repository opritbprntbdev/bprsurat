<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OnlyAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        // Role 1 = Administrator (dari seeder)
        if (!$user || (int) ($user->role_id ?? 0) !== 1) {
            return response()->json(['message' => 'Forbidden: admin only'], 403);
        }
        return $next($request);
    }
}