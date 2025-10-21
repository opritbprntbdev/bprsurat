<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RolesTableSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('roles')) {
            $this->command->warn("Table 'roles' tidak ada. Lewati RolesTableSeeder.");
            return;
        }

        $rows = [
            ['id' => 1, 'name' => 'Admin', 'description' => 'Administrator sistem'],
            ['id' => 2, 'name' => 'Sekper', 'description' => 'Sekretaris Perusahaan'],
            ['id' => 3, 'name' => 'Direksi', 'description' => 'Direktur/Pimpinan'],
            ['id' => 4, 'name' => 'Divisi', 'description' => 'Kepala Divisi'],
            ['id' => 5, 'name' => 'Cabang', 'description' => 'Staff/Kepala Cabang'],
        ];

        $columns = collect(Schema::getColumnListing('roles'));

        foreach ($rows as $row) {
            // siapkan sinonim kolom agar fleksibel dengan skema
            $variants = $row;
            if (isset($row['name'])) {
                $variants['nama'] = $row['name'];
                $variants['role_name'] = $row['name'];
            }
            if (isset($row['description'])) {
                $variants['keterangan'] = $row['description'];
            }

            $data = collect($variants)
                ->only($columns->all())
                ->filter(fn($v) => $v !== null)
                ->all();

            // criteria unik: id > name > nama > role_name
            $unique = ['id' => $row['id']];
            if (!$columns->contains('id')) {
                if ($columns->contains('name'))
                    $unique = ['name' => $row['name']];
                elseif ($columns->contains('nama'))
                    $unique = ['nama' => $row['name']];
                elseif ($columns->contains('role_name'))
                    $unique = ['role_name' => $row['name']];
                else
                    $unique = $data; // fallback
            }

            DB::table('roles')->updateOrInsert($unique, $data);
        }

        $this->command?->info('Roles seeded.');
    }
}