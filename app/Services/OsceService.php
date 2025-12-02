<?php

namespace App\Services;

use App\Models\Osce;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class OsceService
{
    /**
     * Ambil list OSCE (JSON Format)
     */
    public function getAll($search, $tahun)
    {
        $query = Osce::query()->with('tahunAkademik');

        if ($search) {
            $query->where('nama_osce', 'like', '%' . $search . '%');
        }

        if ($tahun) {
            $query->whereHas('tahunAkademik', function ($q) use ($tahun) {
                $q->where('tahun', $tahun);
            });
        }

        $data = $query->orderBy('tanggal_mulai', 'desc')
            ->get()
            ->map(function ($osce) {
                return [
                    "id_osce" => $osce->id_osce,
                    "nama_osce" => $osce->nama_osce,
                    "detail_stase" => $osce->detail_stase ?? "0 Stase",
                    "detail_mahasiswa" => $osce->detail_mahasiswa ?? "0 Mahasiswa",
                    "detail_sesi" => $osce->detail_sesi ?? "0 Sesi",
                    "tanggal_mulai" => $osce->tanggal_mulai,
                    "tanggal_selesai" => $osce->tanggal_selesai,
                    "tahun_akademik" => $osce->tahunAkademik->tahun ?? "N/A",
                ];
            });

        return [
            "success" => true,
            "message" => "Data OSCE berhasil diambil.",
            "data" => $data
        ];
    }

    /**
     * Store OSCE
     */
    public function store($validator)
    {
        $osce = Osce::create($validator->validated());

        return [
            "success" => true,
            "message" => "Data OSCE berhasil dibuat.",
            "data" => $osce
        ];
    }

    /**
     * Update OSCE
     */
    public function update(Osce $osce, $validator)
    {
        
        $osce->update($validator->validated());

        return [
            "success" => true,
            "message" => "Data OSCE berhasil diperbarui.",
            "data" => $osce
        ];
    }

    /**
     * Delete OSCE
     */
    public function destroy(Osce $osce)
    {
        try {
            $osce->delete();
            return [
                "success" => true,
                "message" => "Data OSCE berhasil dihapus.",
                "data" => null
            ];
        } catch (\Exception $e) {
            return [
                "success" => false,
                "message" => "Gagal menghapus OSCE. Pastikan tidak ada data terkait.",
                "data" => null
            ];
        }
    }
}
