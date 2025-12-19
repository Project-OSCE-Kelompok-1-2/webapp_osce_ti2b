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
        Schema::create('enrollment_osce', function (Blueprint $table) {
            $table->id('id_enrollment_osce');

            $table->foreignId('id_osce')
                ->constrained('osce', 'id_osce')
                ->onDelete('cascade');

            $table->foreignId('id_mahasiswa')
                ->constrained('mahasiswa', 'id_mahasiswa')
                ->onDelete('cascade');

            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_osce');
    }
};
