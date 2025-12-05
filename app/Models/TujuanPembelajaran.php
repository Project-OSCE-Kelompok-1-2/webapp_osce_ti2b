<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TujuanPembelajaran extends Model
{
    use HasFactory;

    protected $table = 'tujuan_pembelajaran';
    protected $primaryKey = 'id_tujuan_pembelajaran';
    protected $fillable = ['id_stase', 'tujuan'];

    public function stase()
    {
        return $this->belongsTo(Stase::class, 'id_stase');
    }
}
