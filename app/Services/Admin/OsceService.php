<?php

namespace App\Services\Admin;

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

        $paginator = $query->orderBy('tanggal_mulai', 'desc')->paginate(10)->withQueryString();;

        // Gunakan through() untuk memetakan (map) data di dalam objek paginator
        $data = $paginator->through(function ($osce) {
            return [
                "id_osce" => $osce->id_osce,
                "nama_osce" => $osce->nama_osce,
                "detail_stase" => $osce->detail_stase ?? "0 Stase",
                'id_tahun_akademik' => $osce->id_tahun_akademik,
                "detail_mahasiswa" => $osce->detail_mahasiswa ?? "0 Mahasiswa",
                "detail_sesi" => $osce->detail_sesi ?? "0 Sesi",
                "tanggal_mulai" => $osce->tanggal_mulai->format('Y-m-d'),
                "tanggal_selesai" => $osce->tanggal_selesai->format('Y-m-d'),
                "tahun_akademik_string" => $osce->tahunAkademik->tahun ?? "N/A",
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
