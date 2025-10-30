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
            // Sesuai ERD & Konvensi: Primary Key
            $table->id('id_aspek_penilaian');

            // Sesuai ERD & Aturan: Foreign Key ke tabel 'stase'
            $table->foreignId('id_stase')
                ->constrained('stase', 'id_stase')
                ->onDelete('cascade');

            // Sesuai ERD: Kolom-kolom
            $table->string('aspek');
            $table->integer('bobot_maksimum');

            // Sesuai Aturan: Wajib ada timestamps
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
