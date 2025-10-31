<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PoinAspekPenilaian extends Model
{
    /**
     * Menentukan nama tabel yang terkait dengan model.
     * Perlu didefinisikan karena nama tabel 'poin_aspek_penilaian' (singular)
     * tidak mengikuti konvensi Laravel.
     *
     * @var string
     */
    protected $table = 'poin_aspek_penilaian';

    /**
     * Menentukan primary key tabel.
     * Perlu didefinisikan karena PK-nya 'id_poin_aspek_penilaian', bukan 'id'.
     *
     * @var string
     */
    protected $primaryKey = 'id_poin_aspek_penilaian';

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_aspek_penilaian',
        'kompetensi',
        'skor',
        'bobot',
    ];


    // =========================================================================
    // RELASI ELOQUENT
    // =========================================================================

    /**
     * Mendapatkan data AspekPenilaian yang memiliki Poin Aspek Penilaian ini.
     * Relasi: Many-to-One (PoinAspekPenilaian belongs to AspekPenilaian)
     */
    public function aspekPenilaian(): BelongsTo
    {
        // Parameter:
        // 1. Model terkait (AspekPenilaian::class)
        // 2. Foreign key di tabel ini (id_aspek_penilaian)
        // 3. Primary key di tabel aspek_penilaian (id_aspek_penilaian)
        return $this->belongsTo(AspekPenilaian::class, 'id_aspek_penilaian', 'id_aspek_penilaian');
    }
}