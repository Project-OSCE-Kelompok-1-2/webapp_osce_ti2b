<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogoInstitusi extends Model
{
    use HasFactory;

    protected $table = 'logo_institusi';
    protected $primaryKey = 'id_logo_institusi';
    protected $fillable = [
        'nama_institusi',
        'path_logo',
        'deskripsi',
    ];
}
