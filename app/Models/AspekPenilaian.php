<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AspekPenilaian extends Model
{
    use HasFactory;
    /**
     * @var string
     */
    protected $table = 'aspek_penilaian';

    /**
     * @var string
     */
    protected $primaryKey = 'id_aspek_penilaian';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'id_stase',
        'aspek',
        'bobot_maksimum',
    ];

    public function stase(): BelongsTo
    {

        return $this->belongsTo(Stase::class, 'id_stase', 'id_stase');
    }


    public function poinAspekPenilaian(): HasMany
    {

        return $this->hasMany(PoinAspekPenilaian::class, 'id_aspek_penilaian', 'id_aspek_penilaian');
    }
}
