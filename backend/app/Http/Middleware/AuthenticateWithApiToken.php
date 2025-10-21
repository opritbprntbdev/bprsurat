<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthenticateWithApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization', '');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $token = trim(substr($authHeader, 7));
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('api_token', $token)->first();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Set the authenticated user for this request
        Auth::setUser($user);

        return $next($request);
    }
}