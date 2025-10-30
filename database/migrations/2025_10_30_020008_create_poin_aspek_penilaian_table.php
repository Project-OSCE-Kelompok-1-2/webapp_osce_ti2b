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
            // Sesuai ERD & Konvensi: Primary Key
            $table->id('id_poin_aspek_penilaian');

            // Sesuai ERD & Aturan: Foreign Key ke tabel 'aspek_penilaian'
            // Ini adalah relasi 1-to-Many
            $table->foreignId('id_aspek_penilaian')
                  ->constrained('aspek_penilaian', 'id_aspek_penilaian')
                  ->onDelete('cascade');

            // Sesuai ERD: Kolom-kolom
            $table->text('kompetensi');
            $table->integer('skor');
            $table->integer('bobot');

            // Sesuai Aturan: Wajib ada timestamps
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
