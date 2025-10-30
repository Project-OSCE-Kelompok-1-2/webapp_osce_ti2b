<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengguna extends Model
{
    use HasFactory;

    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';
    protected $fillable = [
        'username',
        'password',
        'jenis_role',
    ];

    // Relasi ke Admin 1:1
    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_pengguna');
    }

    // Relasi ke Penguji 1:1
    public function penguji()
    {
        return $this->hasOne(Penguji::class, 'id_pengguna');
    }

    // Relasi ke Mahasiswa 1:1
    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'id_pengguna');
    }
}
