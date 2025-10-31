<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AspekPenilaian extends Model
{
    /**
     * Menentukan nama tabel yang terkait dengan model.
     * Perlu didefinisikan karena nama tabel 'aspek_penilaian' (singular)
     * tidak mengikuti konvensi Laravel (yang seharusnya 'aspek_penilaians').
     *
     * @var string
     */
    protected $table = 'aspek_penilaian';

    /**
     * Menentukan primary key tabel.
     * Perlu didefinisikan karena PK-nya 'id_aspek_penilaian', bukan 'id'.
     *
     * @var string
     */
    protected $primaryKey = 'id_aspek_penilaian';

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_stase',
        'aspek',
        'bobot_maksimum',
    ];


    // =========================================================================
    // RELASI ELOQUENT
    // =========================================================================

    /**
     * Mendapatkan data Stase yang memiliki Aspek Penilaian ini.
     * Relasi: Many-to-One (AspekPenilaian belongs to Stase)
     */
    public function stase(): BelongsTo
    {
        // Parameter:
        // 1. Model terkait (Stase::class)
        // 2. Foreign key di tabel ini (id_stase)
        // 3. Primary key di tabel stase (diasumsikan 'id_stase' sesuai ERD)
        return $this->belongsTo(Stase::class, 'id_stase', 'id_stase');
    }

    /**
     * Mendapatkan semua PoinAspekPenilaian yang dimiliki oleh Aspek Penilaian ini.
     * Relasi: One-to-Many (AspekPenilaian has many PoinAspekPenilaian)
     */
    public function poinAspekPenilaian(): HasMany
    {
        // Parameter:
        // 1. Model terkait (PoinAspekPenilaian::class)
        // 2. Foreign key di tabel poin_aspek_penilaian (id_aspek_penilaian)
        // 3. Primary key di tabel ini (id_aspek_penilaian)
        return $this->hasMany(PoinAspekPenilaian::class, 'id_aspek_penilaian', 'id_aspek_penilaian');
    }
}