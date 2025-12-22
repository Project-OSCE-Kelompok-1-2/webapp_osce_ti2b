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
        Schema::create('poin_aspek_penilaian', function (Blueprint $table) {
            $table->id('id_poin_aspek_penilaian');

            $table->foreignId('id_aspek_penilaian')
                  ->constrained('aspek_penilaian', 'id_aspek_penilaian')
                  ->onDelete('cascade');

            $table->text('kompetensi');
            $table->integer('skor')->nullable();
            $table->integer('bobot');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poin_aspek_penilaian');
    }
};
