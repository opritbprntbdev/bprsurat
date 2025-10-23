<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest; // tetap pakai kalau file ini ada
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    // GET /api/admin/users?q=...&role_id=...&branch_id=...&status=...
    public function index(Request $request)
    {
        try {
            $q = $request->query('q');
            $roleId = $request->query('role_id');
            $branchId = $request->query('branch_id');
            $status = $request->query('status');

            $query = User::query();

            if ($q) {
                $query->where(function ($qr) use ($q) {
                    $qr->where('name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%");
                });
            }
            if ($roleId)
                $query->where('role_id', $roleId);
            if ($branchId)
                $query->where('branch_id', $branchId);
            if ($status)
                $query->where('status', $status);

            // Kolom dinamis (aman jika ada/tiada kolom)
            $columns = ['id', 'name', 'email', 'role_id', 'status', 'created_at', 'updated_at'];
            if (Schema::hasColumn('users', 'branch_id'))
                $columns[] = 'branch_id';
            if (Schema::hasColumn('users', 'division_id'))
                $columns[] = 'division_id';
            if (Schema::hasColumn('users', 'director_id'))
                $columns[] = 'director_id';

            $perPage = (int) $request->query('per_page', 5);
            $page = (int) $request->query('page', 1);

            $users = $query->select($columns)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json($users);
        } catch (\Throwable $e) {
            Log::error('Admin list users failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'params' => $request->all(),
            ]);
            return response()->json(['message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // POST /api/admin/users
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        if ((int) ($data['role_id'] ?? 0) === 5 && empty($data['branch_id'])) {
            return response()->json(['message' => 'branch_id wajib untuk role Cabang'], 422);
        }

        $tempPassword = $data['password'] ?? Str::random(12);

        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($tempPassword);
        $user->role_id = $data['role_id'] ?? null;
        $user->branch_id = $data['branch_id'] ?? null;
        $user->division_id = $data['division_id'] ?? null;
        $user->director_id = $data['director_id'] ?? null;
        $user->status = $data['status'] ?? 'aktif';

        if (Schema::hasColumn('users', 'must_change_password')) {
            $user->must_change_password = true;
        }

        $user->save();

        return response()->json([
            'message' => 'User created',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'branch_id' => $user->branch_id,
                'division_id' => Schema::hasColumn('users', 'division_id') ? $user->division_id : null,
                'director_id' => Schema::hasColumn('users', 'director_id') ? $user->director_id : null,
                'status' => $user->status,
                'must_change_password' => Schema::hasColumn('users', 'must_change_password') ? (bool) $user->must_change_password : null,
            ],
            // jika password dikirim, tidak perlu tunjukkan temporary password
            'temporary_password' => ($data['password'] ?? null) ? null : $tempPassword
        ], 201);
    }

    // PUT /api/admin/users/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['sometimes', 'integer', 'in:1,2,3,4,5'],
            'status' => ['sometimes', 'in:aktif,nonaktif'],
            'branch_id' => ['nullable', 'integer'],
            'division_id' => ['nullable', 'integer'],
            'director_id' => ['nullable', 'integer'],
        ]);

        try {
            $user = User::findOrFail($id);

            foreach (['name', 'email', 'role_id', 'status'] as $field) {
                if (array_key_exists($field, $validated)) {
                    $user->{$field} = $validated[$field];
                }
            }

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
                if (Schema::hasColumn('users', 'must_change_password')) {
                    $user->must_change_password = false;
                }
            }

            if (Schema::hasColumn('users', 'branch_id') && array_key_exists('branch_id', $validated))
                $user->branch_id = $validated['branch_id'];
            if (Schema::hasColumn('users', 'division_id') && array_key_exists('division_id', $validated))
                $user->division_id = $validated['division_id'];
            if (Schema::hasColumn('users', 'director_id') && array_key_exists('director_id', $validated))
                $user->director_id = $validated['director_id'];

            $user->save();

            return response()->json([
                'message' => 'User updated',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'branch_id' => Schema::hasColumn('users', 'branch_id') ? $user->branch_id : null,
                    'division_id' => Schema::hasColumn('users', 'division_id') ? $user->division_id : null,
                    'director_id' => Schema::hasColumn('users', 'director_id') ? $user->director_id : null,
                    'status' => $user->status,
                    'must_change_password' => Schema::hasColumn('users', 'must_change_password') ? (bool) $user->must_change_password : null,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Admin update user failed', [
                'error' => $e->getMessage(),
                'id' => $id,
                'payload' => $validated,
            ]);
            return response()->json(['message' => 'Internal error: ' . $e->getMessage()], 500);
        }
    }

    // POST /api/admin/users/{id}/reset-password
    public function resetPassword($id)
    {
        $user = User::findOrFail($id);
        $tempPassword = Str::random(12);
        $user->password = Hash::make($tempPassword);
        if (Schema::hasColumn('users', 'must_change_password')) {
            $user->must_change_password = true;
        }
        $user->save();

        return response()->json([
            'message' => 'Temporary password generated',
            'temporary_password' => $tempPassword
        ]);
    }

    // POST /api/admin/users/{id}/deactivate
    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->status = 'nonaktif';
        $user->save();

        return response()->json(['message' => 'User deactivated']);
    }

    // DELETE /api/admin/users/{id}
    public function destroy($id)
    {
        $id = (int) $id;
        $me = Auth::id();

        if ($me === $id) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri'], 422);
        }

        $user = User::findOrFail($id);

        if ((int) $user->role_id === 1) {
            return response()->json(['message' => 'Tidak bisa menghapus user Admin'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}