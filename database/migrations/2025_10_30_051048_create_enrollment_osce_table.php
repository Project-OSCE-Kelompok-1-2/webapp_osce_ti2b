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
            $table->unsignedBigInteger('id_osce');
            $table->text('catatan')->nullable();
            $table->timestamps();

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
        Schema::dropIfExists('enrollment_osce');
    }
};