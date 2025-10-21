<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('users')) {
            $this->command->warn("Table 'users' tidak ada. Lewati UsersTableSeeder.");
            return;
        }

        $now = now();

        // Helper cari ID cabang berdasarkan kode atau nama
        $findBranchId = function (string $code, string $name): ?int {
            if (Schema::hasTable('branches')) {
                $q = DB::table('branches');
                if (Schema::hasColumn('branches', 'kode_cabang')) {
                    $id = $q->where('kode_cabang', $code)->value('id');
                    if ($id)
                        return (int) $id;
                }
                if (Schema::hasColumn('branches', 'code')) {
                    $id = DB::table('branches')->where('code', $code)->value('id');
                    if ($id)
                        return (int) $id;
                }
                if (Schema::hasColumn('branches', 'nama_cabang')) {
                    $id = DB::table('branches')->where('nama_cabang', $name)->value('id');
                    if ($id)
                        return (int) $id;
                }
                if (Schema::hasColumn('branches', 'name')) {
                    $id = DB::table('branches')->where('name', $name)->value('id');
                    if ($id)
                        return (int) $id;
                }
            }
            return null;
        };

        // Helper cari ID divisi
        $findDivisionId = function (string $name): ?int {
            if (Schema::hasTable('divisions')) {
                if (Schema::hasColumn('divisions', 'nama_divisi')) {
                    $id = DB::table('divisions')->where('nama_divisi', $name)->value('id');
                    if ($id)
                        return (int) $id;
                }
                if (Schema::hasColumn('divisions', 'name')) {
                    $id = DB::table('divisions')->where('name', $name)->value('id');
                    if ($id)
                        return (int) $id;
                }
            }
            return null;
        };

        // Helper cari ID direktur berdasar jabatan
        $findDirectorIdByPosition = function (string $position): ?int {
            if (Schema::hasTable('directors')) {
                if (Schema::hasColumn('directors', 'jabatan')) {
                    $id = DB::table('directors')->where('jabatan', $position)->value('id');
                    if ($id)
                        return (int) $id;
                }
                if (Schema::hasColumn('directors', 'position')) {
                    $id = DB::table('directors')->where('position', $position)->value('id');
                    if ($id)
                        return (int) $id;
                }
            }
            return null;
        };

        $branchPusatId = $findBranchId('KC-001', 'Kantor Pusat Mataram');
        $branchPrayaId = $findBranchId('KC-002', 'Praya');
        $divisionKreditId = $findDivisionId('Kredit');
        $dirutId = $findDirectorIdByPosition('Direktur Utama');

        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@bpr.local',
                'password' => Hash::make('Password123!'),
                'role_id' => 1,
                'status' => 'aktif',
                'must_change_password' => false,
            ],
            [
                'name' => 'Sekper',
                'email' => 'sekper@bpr.local',
                'password' => Hash::make('Password123!'),
                'role_id' => 2,
                'status' => 'aktif',
                'branch_id' => $branchPusatId,
                'must_change_password' => false,
            ],
            [
                'name' => 'Direktur Utama',
                'email' => 'dirut@bpr.local',
                'password' => Hash::make('Password123!'),
                'role_id' => 3,
                'status' => 'aktif',
                'director_id' => $dirutId,
                'must_change_password' => false,
            ],
            [
                'name' => 'Kepala Divisi Kredit',
                'email' => 'kredit@bpr.local',
                'password' => Hash::make('Password123!'),
                'role_id' => 4,
                'status' => 'aktif',
                'division_id' => $divisionKreditId,
                'must_change_password' => false,
            ],
            [
                'name' => 'User Cabang Praya',
                'email' => 'praya@bpr.local',
                'password' => Hash::make('Password123!'),
                'role_id' => 5,
                'status' => 'aktif',
                'branch_id' => $branchPrayaId,
                'must_change_password' => false,
            ],
        ];

        $columns = collect(Schema::getColumnListing('users'));

        foreach ($users as $row) {
            $row['created_at'] = $now;
            $row['updated_at'] = $now;

            // Hanya ambil kolom yang tersedia
            $data = collect($row)
                ->only($columns->all())
                ->all();

            // Unik berdasarkan email (umum)
            if ($columns->contains('email')) {
                DB::table('users')->updateOrInsert(['email' => $row['email']], $data);
            } else {
                DB::table('users')->updateOrInsert(['name' => $row['name']], $data);
            }
        }

        $this->command?->info('Users seeded/updated (admin, sekper, dirut, kepala divisi, cabang praya).');
    }
}