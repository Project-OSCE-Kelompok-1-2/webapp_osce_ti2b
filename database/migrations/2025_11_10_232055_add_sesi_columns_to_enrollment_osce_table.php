<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollment_osce', function (Blueprint $table) {
            // Tambahkan kolom baru setelah 'id_mahasiswa' (atau di mana saja)
            $table->date('tanggal_sesi')->nullable()->after('id_mahasiswa');
            $table->time('jam_sesi')->nullable()->after('tanggal_sesi');
        });
    }

    public function down(): void
    {
        Schema::table('enrollment_osce', function (Blueprint $table) {
            $table->dropColumn(['tanggal_sesi', 'jam_sesi']);
        });
    }
};