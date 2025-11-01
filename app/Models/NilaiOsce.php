<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiOsce extends Model
{
    /** @use HasFactory<\Database\Factories\NilaiOsceFactory> */
    use HasFactory;

    protected $table = 'nilai_osce';
    protected $primaryKey = 'id_nilai_osce';
    public $timestamps = true;

    protected $fillable = [
        'id_enrollment_osce',
        'id_poin_aspek_penilaian',
        'nilai',
    ];

    // relasi ke enrollment_osce 1:1
    public function enrollmentOsce()
    {
        return $this->belongsTo(EnrollmentOsce::class, 'id_enrollment_osce');
    }

    // relasi ke poin_aspek_penilaian 1:1
    public function poinAspekPenilaian()
    {
        return $this->belongsTo(PoinAspekPenilaian::class, 'id_poin_aspek_penilaian'); //perlu relasi ke model PoinAspekPenilaian
    }

    protected function casts(): array
    {
        return [
            'nilai' => 'decimal:2',
        ];
    }
}
