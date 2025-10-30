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
        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->id('id_mata_kuliah');
            $table->foreignId('id_blok')->constrained('blok', 'id_blok')->onDelete('cascade');
            $table->foreignId('id_enrollment')->constrained('enrollment', 'id_enrollment')->onDelete('cascade');
            $table->string('nama_mata_kuliah', 150);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliah');
    }
};
