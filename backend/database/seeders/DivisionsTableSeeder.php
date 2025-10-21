<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DivisionsTableSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('divisions')) {
            $this->command->warn("Table 'divisions' tidak ada. Lewati DivisionsTableSeeder.");
            return;
        }

        $names = ['Kredit', 'Operasional', 'SDM', 'IT', 'Keuangan', 'Legal', 'Marketing', 'Audit Internal', 'Umum'];

        $columns = collect(Schema::getColumnListing('divisions'));
        $colName = $columns->contains('nama_divisi') ? 'nama_divisi' : ($columns->contains('name') ? 'name' : null);
        $hasCreatedAt = $columns->contains('created_at');
        $hasUpdatedAt = $columns->contains('updated_at');

        foreach ($names as $name) {
            $data = [];
            if ($colName)
                $data[$colName] = $name;
            if ($columns->contains('description'))
                $data['description'] = $data['description'] ?? null;
            if ($columns->contains('keterangan'))
                $data['keterangan'] = $data['keterangan'] ?? null;
            if ($hasCreatedAt)
                $data['created_at'] = now();
            if ($hasUpdatedAt)
                $data['updated_at'] = now();

            $unique = $colName ? [$colName => $name] : $data;

            DB::table('divisions')->updateOrInsert($unique, $data);
        }

        $this->command?->info('Divisions seeded/updated.');
    }
}