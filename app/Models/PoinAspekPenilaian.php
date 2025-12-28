<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PoinAspekPenilaian extends Model
{
    use HasFactory;
    /**
     * @var string
     */
    protected $table = 'poin_aspek_penilaian';

    /**
     * @var string
     */
    protected $primaryKey = 'id_poin_aspek_penilaian';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'id_aspek_penilaian',
        'kompetensi',
        'skor',
        'bobot',
    ];


    public function aspekPenilaian(): BelongsTo
    {
        return $this->belongsTo(AspekPenilaian::class, 'id_aspek_penilaian', 'id_aspek_penilaian');
    }

    public function nilai_osce()
    {
        return $this->hasOne(NilaiOsce::class, 'id_poin_aspek_penilaian');
    }
}
