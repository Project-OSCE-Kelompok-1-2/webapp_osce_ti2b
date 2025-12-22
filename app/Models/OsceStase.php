<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OsceStase extends Model
{
    use HasFactory;

    protected $table = 'osce_stase';
    protected $primaryKey = 'id_osce_stase';
    public $timestamps = true;

    protected $fillable = [
        'id_penguji',
        'id_ruang',
        'id_osce',
        'id_stase',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'skenario',
        'durasi_per_mahasiswa',
    ];

    public function penguji()
    {
        return $this->belongsTo(Penguji::class, 'id_penguji');
    }

    public function ruang()
    {
        return $this->belongsTo(Ruang::class, 'id_ruang');
    }

    public function osce()
    {
        return $this->belongsTo(Osce::class, 'id_osce');
    }

    public function stase()
    {
        return $this->belongsTo(Stase::class, 'id_stase');
    }

    protected $casts = [
        'tanggal' => 'date',
        'jam_mulai' => 'string',
        'jam_selesai' => 'string',
        'durasi_per_mahasiswa' => 'integer',
    ];
}
