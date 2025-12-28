<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahunAkademik extends Model
{
    use HasFactory;

    protected $table = 'tahun_akademik';
    protected $primaryKey = 'id_tahun_akademik';
    protected $fillable = [
        'tahun',
        'semester',
        'status',
        'mulai_input_nilai',
        'selesai_input_nilai',
    ];

    public function enrollment()
    {
        return $this->hasMany(Enrollment::class, 'id_tahun_akademik'); 
    }

    public function osce()
    {
        return $this->hasMany(Osce::class, 'id_tahun_akademik');
    }
}
