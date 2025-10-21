<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BranchesTableSeeder extends Seeder
{
    public function run(): void
    {
        if (!Schema::hasTable('branches')) {
            $this->command->warn("Table 'branches' tidak ada. Lewati BranchesTableSeeder.");
            return;
        }

        // 44 cabang (contoh nama; silakan sesuaikan nanti jika perlu)
        $names = [
            'Kantor Pusat Mataram',
            'Praya',
            'Sumbawa Besar',
            'Bima',
            'Dompu',
            'Taliwang',
            'Sumbawa Barat',
            'Gerung',
            'Selong',
            'Pringgabaya',
            'Sakra',
            'Aikmel',
            'Masbagik',
            'Kopang',
            'Jonggat',
            'Narmada',
            'Lingsar',
            'Gunungsari',
            'Ampenan',
            'Cakranegara',
            'Mandalika',
            'Batu Kliang',
            'Kuripan',
            'Kediri',
            'Labuhan Haji',
            'Terara',
            'Suralaga',
            'Sembalun',
            'Sambelia',
            'Alas',
            'Plampang',
            'Empang',
            'Lape',
            'Woha',
            'Donggo',
            'Monta',
            'Madapangga',
            'Parado',
            'Kilo',
            'Hu\'u',
            'Pajo',
            'Pekat',
            'Kempo',
            'Dompu Kota'
        ];
        while (count($names) < 44) {
            $names[] = 'Cabang ' . str_pad((string) (count($names) + 1), 2, '0', STR_PAD_LEFT);
        }

        $columns = collect(Schema::getColumnListing('branches'));

        // Deteksi nama kolom yang tersedia
        $colCode = $columns->contains('kode_cabang') ? 'kode_cabang' : ($columns->contains('code') ? 'code' : null);
        $colName = $columns->contains('nama_cabang') ? 'nama_cabang' : ($columns->contains('name') ? 'name' : null);
        $colAddress = $columns->contains('alamat') ? 'alamat' : ($columns->contains('address') ? 'address' : null);
        $colPhone = $columns->contains('telepon') ? 'telepon' : ($columns->contains('phone') ? 'phone' : null);
        $hasCreatedAt = $columns->contains('created_at');
        $hasUpdatedAt = $columns->contains('updated_at');

        foreach ($names as $i => $name) {
            $code = 'KC-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT);

            // Siapkan data insert/update tanpa kolom 'id' supaya tidak bentrok PK
            $data = [];
            if ($colCode)
                $data[$colCode] = $code;
            if ($colName)
                $data[$colName] = $name;
            if ($colAddress)
                $data[$colAddress] = $data[$colAddress] ?? null;
            if ($colPhone)
                $data[$colPhone] = $data[$colPhone] ?? null;
            if ($hasCreatedAt)
                $data['created_at'] = now();
            if ($hasUpdatedAt)
                $data['updated_at'] = now();

            // Tentukan kunci unik untuk updateOrInsert
            $unique = [];
            if ($colCode)
                $unique[$colCode] = $code;
            elseif ($colName)
                $unique[$colName] = $name;
            else {
                // fallback: jika tidak ada kolom code/name, gunakan kombinasi data (jarang terjadi)
                $unique = $data;
            }

            DB::table('branches')->updateOrInsert($unique, $data);
        }

        $this->command?->info('Branches (44) seeded/updated without forcing ID.');
    }
}