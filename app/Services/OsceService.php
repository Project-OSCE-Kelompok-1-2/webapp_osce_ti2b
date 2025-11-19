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
    public function getAll($request)
    {
        $query = Osce::query()->with('tahunAkademik');

        if ($request->search) {
            $query->where('nama_osce', 'like', '%' . $request->search . '%');
        }

        if ($request->tahun) {
            $query->whereHas('tahunAkademik', function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
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
    public function store($request)
    {
        $validator = Validator::make($request->all(), [
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        if ($validator->fails()) {
            return [
                "success" => false,
                "message" => $validator->errors()->first(),
                "data" => null
            ];
        }

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
    public function update($request, Osce $osce)
    {
        $validator = Validator::make($request->all(), [
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => [
                'required',
                'string',
                'max:255',
                Rule::unique('osce')->ignore($osce->id_osce, 'id_osce')
            ],
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        if ($validator->fails()) {
            return [
                "success" => false,
                "message" => $validator->errors()->first(),
                "data" => null
            ];
        }

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
