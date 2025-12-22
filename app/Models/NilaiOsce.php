<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiOsce extends Model
{
    use HasFactory;

    protected $table = 'nilai_osce';
    protected $primaryKey = 'id_nilai_osce';
    public $timestamps = true;

    protected $fillable = [
        'id_enrollment_osce',
        'id_poin_aspek_penilaian',
        'nilai',
    ];

    public function enrollmentOsce()
    {
        return $this->belongsTo(EnrollmentOsce::class, 'id_enrollment_osce');
    }

    public function poinAspekPenilaian()
    {
        return $this->belongsTo(PoinAspekPenilaian::class, 'id_poin_aspek_penilaian'); 
    }

    protected function casts(): array
    {
        return [
            'nilai' => 'float',
        ];
    }
}
