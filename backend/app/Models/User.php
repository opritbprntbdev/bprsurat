<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'branch_id',
        'division_id',
        'director_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Hapus: createApiToken, revokeApiToken, verifyPassword
    // Sanctum otomatis pakai createToken() dan Hash::check() langsung
}