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
            $table->unsignedBigInteger('id_ruang');
            $table->unsignedBigInteger('id_osce');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('skenario', 255);
            $table->integer('durasi_per_mahasiswa');
            $table->timestamps();

            $table->foreign('id_ruang')
                ->references('id_ruang')
                ->on('ruang')
                ->onDelete('cascade');

            $table->foreign('id_osce')
                ->references('id_osce')
                ->on('osce')
                ->onDelete('cascade');

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