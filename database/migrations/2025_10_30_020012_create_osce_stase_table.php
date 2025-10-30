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
        Schema::create('osce_stase', function (Blueprint $table) {
            $table->id('id_osce_stase');
            $table->foreignId('id_penguji')->constrained('penguji', 'id_penguji')->onDelete('cascade');
            $table->foreignId('id_ruang')->constrained('ruang', 'id_ruang')->onDelete('cascade');
            $table->foreignId('id_osce')->constrained('osce', 'id_osce')->onDelete('cascade');
            $table->foreignId('id_stase')->constrained('stase', 'id_stase')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->text('skenario');
            $table->integer('durasi_per_mahasiswa')->comment('dalam menit');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('osce_stase');
    }
};
