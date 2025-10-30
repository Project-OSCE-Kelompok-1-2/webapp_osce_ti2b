<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Pengguna extends Authenticatable
{
    use HasFactory;

    protected $table = 'pengguna';
    protected $primaryKey = 'id_pengguna';

    protected $fillable = [
        'username',
        'password',
        'jenis_role',
    ];

    /**
     * Relasi ke Admin 1:1
     */
    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_pengguna');
    }

    /**
     * Relasi ke Penguji 1:1
     */
    public function penguji()
    {
        return $this->hasOne(Penguji::class, 'id_pengguna');
    }

    /**
     * Relasi ke Mahasiswa 1:1
     */
    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'id_pengguna');
    }

    /**
     * Scope untuk filter berdasarkan role.
     */
    public function scopeRole($query, string $role)
    {
        return $query->where('jenis_role', $role);
    }

    /**
     * Cek role pengguna.
     */
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

    /**
     * Hidden attributes saat return JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Cast password agar otomatis di-hash (Laravel 10+)
     */
    protected $casts = [
        'password' => 'hashed',
    ];
}
