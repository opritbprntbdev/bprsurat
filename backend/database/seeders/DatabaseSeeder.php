<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Urutan penting: roles -> branches -> divisions -> directors -> users
        $this->call([
            RolesTableSeeder::class,
            BranchesTableSeeder::class,
            DivisionsTableSeeder::class,
            DirectorsTableSeeder::class,
            UsersTableSeeder::class,
        ]);
    }
}