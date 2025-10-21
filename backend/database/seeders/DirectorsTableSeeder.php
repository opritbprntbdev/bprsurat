<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DirectorsTableSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('directors')) {
            $this->command->warn("Table 'directors' tidak ada. Lewati DirectorsTableSeeder.");
            return;
        }

        $rows = [
            ['name' => 'Dr. Ahmad Fauzi', 'position' => 'Direktur Utama'],
            ['name' => 'Ir. Siti Nurhaliza', 'position' => 'Direktur Operasional'],
            ['name' => 'Drs. Budi Santoso', 'position' => 'Direktur Kredit'],
            ['name' => 'H. Abdul Karim, SH', 'position' => 'Direktur Kepatuhan'],
        ];

        $columns = collect(Schema::getColumnListing('directors'));

        // Deteksi nama kolom yang tersedia
        $colName = null;
        if ($columns->contains('nama_direksi')) {
            $colName = 'nama_direksi';
        } elseif ($columns->contains('nama')) {
            $colName = 'nama';
        } elseif ($columns->contains('name')) {
            $colName = 'name';
        }

        $colPos = null;
        if ($columns->contains('jabatan')) {
            $colPos = 'jabatan';
        } elseif ($columns->contains('position')) {
            $colPos = 'position';
        }

        $hasCreatedAt = $columns->contains('created_at');
        $hasUpdatedAt = $columns->contains('updated_at');

        foreach ($rows as $row) {
            $data = [];

            // WAJIB isi kolom nama sesuai skema (untuk hindari error NOT NULL)
            if ($colName) {
                $data[$colName] = $row['name'];
            }

            if ($colPos) {
                $data[$colPos] = $row['position'];
            }

            if ($hasCreatedAt)
                $data['created_at'] = now();
            if ($hasUpdatedAt)
                $data['updated_at'] = now();

            // Unik berdasarkan kolom nama yang tersedia
            $unique = $colName ? [$colName => $row['name']] : ($colPos ? [$colPos => $row['position']] : $data);

            DB::table('directors')->updateOrInsert($unique, $data);
        }

        $this->command?->info('Directors seeded/updated.');
    }
}