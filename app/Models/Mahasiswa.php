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
        'status',
    ];

    // Relasi ke Pengguna
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    // Relasi ke Enrollment 1:M
    public function enrollment()
    {
        return $this->hasMany(Enrollment::class, 'id_mahasiswa'); // Perlu Model Enrollment
    }
}
