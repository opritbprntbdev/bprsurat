<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Login gagal, cek email/password'], 422);
        }

        // Sanctum: buat token baru (opsional hapus token lama)
        // $user->tokens()->delete(); // uncomment jika ingin single device
        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'ok',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'branch_id' => $user->branch_id,
                'division_id' => $user->division_id,
                'director_id' => $user->director_id,
                'status' => $user->status,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'logged out']);
    }
}