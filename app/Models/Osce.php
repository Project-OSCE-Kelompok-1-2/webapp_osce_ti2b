<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Osce extends Model
{
    /** @use HasFactory<\Database\Factories\OsceFactory> */
    use HasFactory;

    protected $table = 'osce';
    protected $primaryKey = 'id_osce';
    public $timestamps = true;

    protected $fillable = [
        'id_tahun_akademik',
        'nama_osce',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    // Relasi ke tahun_akademik 1:1
    public function tahunAkademik()
    {
        return $this->belongsTo(TahunAkademik::class, 'id_tahun_akademik');
    }
    // Relasi ke osce_stase 1:M
    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_osce');
    }

    // relasi ke enrollment_osce 1:M
    public function enrollmentOsce()
    {
        return $this->hasMany(EnrollmentOsce::class, 'id_osce');
    }

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }
}
