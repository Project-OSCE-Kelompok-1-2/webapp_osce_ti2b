<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TujuanPembelajaran extends Model
{
    use HasFactory;

    protected $table = 'tujuan_pembelajaran';
    protected $primarykey = 'id_tujuan_pembelajaran';
    protected $fillable = ['tujuan'];

    public function stase()
    {
        return $this->hasMany(Stase::class, 'id_tujuan_pembelajaran');
    }
}
