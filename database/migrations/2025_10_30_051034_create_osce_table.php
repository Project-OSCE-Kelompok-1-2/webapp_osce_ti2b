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
        Schema::create('osce', function (Blueprint $table) {
            $table->id('id_osce');
            $table->string('nama_osce', 25);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('osce');
    }
};