<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Pengguna extends Authenticatable
{
    use HasApiTokens, HasFactory; 

    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';

    protected $fillable = [
        'username',
        'password',
        'jenis_role',
        'path_gambar',
    ];

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_pengguna');
    }

    public function penguji()
    {
        return $this->hasOne(Penguji::class, 'id_pengguna');
    }

    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'id_pengguna');
    }

    public function scopeRole($query, string $role)
    {
        return $query->where('jenis_role', $role);
    }

    public function isMahasiswa(): bool
    {
        return $this->jenis_role === 'mahasiswa';
    }

    public function isPenguji(): bool
    {
        return $this->jenis_role === 'penguji';
    }

    public function isAdmin(): bool
    {
        return $this->jenis_role === 'admin';
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];
}