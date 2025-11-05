<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Osce extends Model
{
    /** @use HasFactory<\Database\Factories\OsceFactory> */
    use HasFactory;

    protected $table = 'osce';
    protected $primaryKey = 'id_osce';
    public $timestamps = true;

    protected $fillable = [
        'id_tahun_akademik',
        'nama_osce',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    // Otomatis menambahkan atribut tambahan ke response JSON
    protected $appends = ['jumlah_stase', 'jumlah_mahasiswa'];

    /**
     * Relasi ke tabel tahun_akademik (1 OSCE : 1 Tahun Akademik)
     */
    public function tahunAkademik()
    {
        return $this->belongsTo(TahunAkademik::class, 'id_tahun_akademik');
    }

    /**
     * Relasi ke tabel osce_stase (1 OSCE : Banyak Stase)
     */
    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_osce');
    }

    /**
     * Relasi ke tabel enrollment_osce (1 OSCE : Banyak Mahasiswa)
     */
    public function enrollmentOsce()
    {
        return $this->hasMany(EnrollmentOsce::class, 'id_osce');
    }

    /**
     * Atribut tambahan: jumlah stase
     */
    public function getJumlahStaseAttribute()
    {
        return $this->osceStase()->count();
    }

    /**
     * Atribut tambahan: jumlah mahasiswa unik
     */
    public function getJumlahMahasiswaAttribute()
    {
        return $this->enrollmentOsce()
            ->distinct('id_mahasiswa')
            ->count('id_mahasiswa');
    }

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }
}
