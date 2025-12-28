<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Osce extends Model
{
    use HasFactory;
    protected $table = 'osce';

    protected $primaryKey = 'id_osce';

    protected $fillable = [
        'id_tahun_akademik',
        'nama_osce',
        'tanggal_mulai',
        'tanggal_selesai',
        'keterangan',
    ];

    protected $appends = [
        'detail_stase',
        'detail_mahasiswa',
        'detail_sesi',
        'tahun_akademik_string',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime:d-m-Y',
        'tanggal_selesai' => 'datetime:d-m-Y', 
    ];

    /**
     * Relasi ke tabel osce_stase
     */
    public function osceStase()
    {
        return $this->hasMany(OsceStase::class, 'id_osce');
    }

    /**
     * Relasi ke tabel enrollment_osce
     */
    public function enrollmentOsce()
    {
        return $this->hasMany(EnrollmentOsce::class, 'id_osce');
    }

    /**
     * Relasi ke tahun akademik
     */
    public function tahunAkademik()
    {
        return $this->belongsTo(TahunAkademik::class, 'id_tahun_akademik');
    }

    /**
     * Atribut tambahan: detail stase
     */
    public function getDetailStaseAttribute()
    {
        return $this->osceStase()->count() . ' Stase';
    }

    /**
     * Atribut tambahan: detail mahasiswa unik
     */
    public function getDetailMahasiswaAttribute()
    {
        return $this->enrollmentOsce()
            ->distinct('id_mahasiswa')
            ->count('id_mahasiswa') . ' Mahasiswa';
    }

    /**
     * Atribut tambahan: detail sesi unik berdasarkan tanggal dan jam
     */
    public function getDetailSesiAttribute()
    {
        return $this->osceStase()
            ->distinct(['tanggal', 'jam_mulai'])
            ->count('tanggal') . ' Sesi';
    }

    /**
     * Atribut tambahan: string tahun akademik
     */
    public function getTahunAkademikStringAttribute()
    {
        return $this->tahunAkademik ? $this->tahunAkademik->tahun : null;
    }
}
