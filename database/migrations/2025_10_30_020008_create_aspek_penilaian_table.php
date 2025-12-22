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
        Schema::create('aspek_penilaian', function (Blueprint $table) {
            $table->id('id_aspek_penilaian');

            $table->foreignId('id_stase')
                ->constrained('stase', 'id_stase')
                ->onDelete('cascade');

            $table->string('aspek');
            $table->integer('bobot_maksimum');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aspek_penilaian');
    }
};
