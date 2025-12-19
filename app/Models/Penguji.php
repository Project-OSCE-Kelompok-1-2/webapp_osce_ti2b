<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penguji extends Model
{
    use HasFactory;

    protected $table = 'penguji';
    protected $primaryKey = 'id_penguji';
    protected $fillable = [
        'id_pengguna',
        'nama',
        'nip',
    ];

    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna');
    }

    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_penguji'); 
    }
}
