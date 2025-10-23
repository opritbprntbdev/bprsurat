<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

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

        // Try to resolve token using Sanctum's PersonalAccessToken
        $tokenModel = PersonalAccessToken::findToken($token);
        if (!$tokenModel) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $tokenModel->tokenable; // the user model associated with this token
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Set the authenticated user for this request
        Auth::setUser($user);

        return $next($request);
    }
}