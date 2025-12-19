<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentOsce extends Model
{
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

    protected $casts = [
        'tanggal_sesi' => 'date:Y-m-d',
        'catatan' => 'string',
    ];

    public function osce()
    {
        return $this->belongsTo(Osce::class, 'id_osce');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa'); 
    }

    public function nilaiOsce()
    {
        return $this->hasMany(NilaiOsce::class, 'id_enrollment_osce');
    }

    protected function casts(): array
    {
        return [
            'catatan' => 'string',
        ];
    }
}
