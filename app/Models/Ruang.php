<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruang extends Model
{
    /** @use HasFactory<\Database\Factories\RuangFactory> */
    use HasFactory;

    protected $table = 'ruang';
    protected $primaryKey = 'id_ruang';
    public $timestamps = false;

    protected $fillable = [
        'nomor_ruangan',
        'lokasi',
    ];

    // relasi ke osce_stase 1:M
    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_ruang');
    }

    protected function casts(): array
    {
        return [
            'nomor_ruangan' => 'string',
            'lokasi' => 'string',
        ];
    }
}