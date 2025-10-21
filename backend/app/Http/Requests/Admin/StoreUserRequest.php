<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8'], // kalau kosong, sistem buatkan
            'role_id' => ['required', 'integer'],        // 1=Admin, 2=Sekper, 3=Direksi, 4=Divisi, 5=Cabang
            'branch_id' => ['nullable', 'integer'],        // wajib jika role=5
            'division_id' => ['nullable', 'integer'],
            'director_id' => ['nullable', 'integer'],
            'status' => ['nullable', 'in:aktif,nonaktif'],
        ];
    }
}