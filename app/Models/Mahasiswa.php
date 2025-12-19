<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';
    protected $primaryKey = 'id_mahasiswa';
    protected $fillable = [
        'id_pengguna',
        'nama',
        'nim',
        'kelas',
        'prodi',
        'status',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function enrollment()
    {
        return $this->hasMany(Enrollment::class, 'id_mahasiswa'); 
    }

    public function enrollment_osce()
    {
        return $this->hasMany(EnrollmentOsce::class, 'id_mahasiswa');
    }
}
