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
        Schema::create('nilai_osce', function (Blueprint $table) {
            $table->id('id_nilai_osce');
            $table->unsignedBigInteger('id_enrollment_osce');
            $table->integer('nilai');
            $table->timestamps();

            $table->foreign('id_enrollment_osce')
                ->references('id_enrollment_osce')
                ->on('enrollment_osce')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_osce');
    }
};