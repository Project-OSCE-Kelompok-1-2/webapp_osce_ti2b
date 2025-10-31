<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentFactory> */
    use HasFactory;

    protected $table = 'enrollment';
    protected $primaryKey = 'id_enrollment';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id_mahasiswa',
        'id_tahun_akademik',
        'tanggal_daftar',
    ];

    /**
     * Define relationships.
     */
    // relasi ke mahasiswa M:1
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa'); //perlu relasi ke model Mahasiswa
    }

    // relasi ke tahun_akademik M:1
    public function tahunAkademik()
    {
        return $this->belongsTo(TahunAkademik::class, 'id_tahun_akademik'); //perlu relasi ke model TahunAkademik
    }

    protected function casts(): array
    {
        return [
            'tanggal_daftar' => 'date',
        ];
    }
}