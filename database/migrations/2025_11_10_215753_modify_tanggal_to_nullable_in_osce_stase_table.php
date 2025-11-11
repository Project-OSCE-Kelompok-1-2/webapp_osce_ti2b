<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('osce_stase', function (Blueprint $table) {
            $table->date('tanggal')->nullable()->change();
            $table->time('jam_mulai')->nullable()->change();
            $table->time('jam_selesai')->nullable()->change(); 
            $table->text('skenario')->nullable()->change(); 
            
            // 👇 TAMBAHKAN BARIS INI
            // Asumsi tipe datanya integer, ganti jika perlu
            $table->integer('durasi_per_mahasiswa')->nullable()->change(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('osce_stase', function (Blueprint $table) {
            $table->date('tanggal')->nullable(false)->change();
            $table->time('jam_mulai')->nullable(false)->change();
            $table->time('jam_selesai')->nullable(false)->change();
            $table->text('skenario')->nullable(false)->change();

            // 👇 TAMBAHKAN ROLLBACK INI
            $table->integer('durasi_per_mahasiswa')->nullable(false)->change();
        });
    }
};