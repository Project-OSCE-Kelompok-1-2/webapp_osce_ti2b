<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';
    protected $primarykey = 'id_mata_kuliah';
    protected $fillable = ['id_blok', 'id_enrollment', 'nama_mata_kuliah', 'deskripsi'];

    public function blok()
    {
        return $this->belongsTo(Blok::class, 'id_blok');
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class, 'id_enrollment');
    }

    public function stase()
    {
        return $this->hasMany(Stase::class, 'id_mata_kuliah');
    }
}
