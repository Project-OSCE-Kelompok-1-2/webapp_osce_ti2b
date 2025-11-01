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
            $table->foreignId('id_enrollment_osce')->constrained('enrollment_osce', 'id_enrollment_osce')->onDelete('cascade');
            $table->foreignId('id_poin_aspek_penilaian')->constrained('poin_aspek_penilaian', 'id_poin_aspek_penilaian')->onDelete('cascade');
            $table->integer('nilai');
            $table->timestamps();
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
