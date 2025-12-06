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
        Schema::create('stase', function (Blueprint $table) {
            $table->id('id_stase');
            $table->foreignId('id_mata_kuliah')->constrained('mata_kuliah', 'id_mata_kuliah')->onDelete('cascade');
            $table->string('nama_stase', 150);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stase');
    }
};
