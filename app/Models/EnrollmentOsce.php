<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentOsce extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentOsceFactory> */
    use HasFactory;

    protected $table = 'enrollment_osce';
    protected $primaryKey = 'id_enrollment_osce';
    public $timestamps = false;

    protected $fillable = [
        'id_osce',
        'id_mahasiswa',
        'catatan',
        'tanggal_sesi',
        'jam_sesi',
    ];

    // Casting agar format tanggal aman
    protected $casts = [
        'tanggal_sesi' => 'date:Y-m-d',
        'catatan' => 'string',
    ];

    // relasi ke osce M:1
    public function osce()
    {
        return $this->belongsTo(Osce::class, 'id_osce');
    }

    // relasi ke mahasiswa M:1
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa'); //perlu relasi ke model Mahasiswa
    }

    // relasi ke nilai_osce 1:1
    public function nilaiOsce()
    {
        return $this->hasOne(NilaiOsce::class, 'id_enrollment_osce');
    }

    protected function casts(): array
    {
        return [
            'catatan' => 'string',
        ];
    }
}
