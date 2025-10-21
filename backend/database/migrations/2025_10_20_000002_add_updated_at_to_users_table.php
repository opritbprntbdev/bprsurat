<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Pastikan tabel 'users' ada sebelum menjalankan migration ini
        Schema::table('users', function (Blueprint $table) {
            // Tambahkan kolom updated_at bila belum ada
            if (!Schema::hasColumn('users', 'updated_at')) {
                // nullable supaya tidak menyebabkan masalah untuk row lama
                $table->timestamp('updated_at')->nullable()->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))->after('created_at');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};