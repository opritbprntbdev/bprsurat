<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LettersController;
use App\Http\Controllers\Api\Admin\UsersController;
use App\Http\Controllers\Api\Admin\LogsController;


Route::get('/health', function () {
    return response()->json(['ok' => true]);
});

// auth
Route::post('/auth/login', [AuthController::class, 'login']);

// protected group menggunakan middleware auth.apitoken
Route::middleware('auth.apitoken')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // letters
    Route::get('/letters', [LettersController::class, 'index']);
    Route::get('/letters/{id}', [LettersController::class, 'show']);
    Route::post('/letters', [LettersController::class, 'store']);
    Route::put('/letters/{id}', [LettersController::class, 'update']);
    Route::post('/letters/{id}/send', [LettersController::class, 'sendToSekper']);
});

Route::middleware('auth.apitoken')->group(function () {
    // ... routes lain (letters, logout, dll)

    // ADMIN ONLY
    Route::middleware('only.admin')->prefix('admin')->group(function () {
        Route::get('/users', [UsersController::class, 'index']);
        Route::post('/users', [UsersController::class, 'store']);
        Route::put('/users/{id}', [UsersController::class, 'update']);
        Route::post('/users/{id}/reset-password', [UsersController::class, 'resetPassword']);
        Route::post('/users/{id}/deactivate', [UsersController::class, 'deactivate']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/users', [UsersController::class, 'index']);
    Route::post('/admin/users', [UsersController::class, 'store']);
    Route::put('/admin/users/{id}', [UsersController::class, 'update']);
    Route::post('/admin/users/{id}/reset-password', [UsersController::class, 'resetPassword']);
    Route::post('/admin/users/{id}/deactivate', [UsersController::class, 'deactivate']);
    Route::delete('/admin/users/{id}', [UsersController::class, 'destroy']); // <— baru

    // viewer log
    Route::get('/admin/logs', [LogsController::class, 'tail']);
});