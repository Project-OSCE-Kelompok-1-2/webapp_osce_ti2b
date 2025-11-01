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
        Schema::create('enrollment', function (Blueprint $table) {
            $table->id('id_enrollment');
            $table->foreignId('id_mahasiswa')->constrained('mahasiswa', 'id_mahasiswa')->onDelete('cascade');
            $table->foreignId('id_tahun_akademik')->constrained('tahun_akademik', 'id_tahun_akademik')->onDelete('cascade');
            $table->date('tanggal_daftar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment');
    }
};
