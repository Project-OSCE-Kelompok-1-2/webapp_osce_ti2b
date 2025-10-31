<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactories;
use Illuminate\Database\Eloquent\Model;

class Blok extends Model
{
    use HasFactory;
    
    protected $table = 'blok';
    protected $primaryKey = 'id_blok';
    protected $fillable = ['nama_blok', 'deskripsi'];

    public function mataKuliah()
    {
        return $this->hasMany(MataKuliah::class, 'id_blok');
    }
}
