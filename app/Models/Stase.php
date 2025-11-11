<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stase extends Model
{
    use HasFactory;

    protected $table = 'stase';
    protected $primaryKey = 'id_stase';
    protected $fillable = ['id_mata_kuliah', 'id_tujuan_pembelajaran', 'nama_stase', 'deskripsi'];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'id_mata_kuliah');
    }

    public function tujuanPembelajaran()
    {
        return $this->belongsTo(TujuanPembelajaran::class, 'id_tujuan_pembelajaran');
    }

    public function aspekPenilaian()
    {
        return $this->hasMany(AspekPenilaian::class, 'id_stase');
    }

    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_stase');
    }
}
