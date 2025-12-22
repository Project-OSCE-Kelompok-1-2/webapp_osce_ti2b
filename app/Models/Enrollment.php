<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollment';
    protected $primaryKey = 'id_enrollment';
    public $timestamps = true;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'id_mahasiswa',
        'id_tahun_akademik',
        'tanggal_daftar',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa'); 
    }

    public function tahunAkademik()
    {
        return $this->belongsTo(TahunAkademik::class, 'id_tahun_akademik');
    }
    public function mataKuliah()
    {
        return $this->hasMany(MataKuliah::class, 'id_enrollment');
    }

    protected function casts(): array
    {
        return [
            'tanggal_daftar' => 'date',
        ];
    }
}
