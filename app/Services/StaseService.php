<?php

namespace App\Services;

use App\Models\Stase;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class StaseService
{
    public function getAll($search)
    {
        $data = Stase::query()
            ->when($search, function ($q, $search) {
                $q->where('nama_stase', 'like', "%{$search}%");
            })
            ->withCount('aspekPenilaian')
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'id_stase' => $item->id_stase,
                    'nama_stase' => $item->nama_stase,
                    'jumlah_aspek' => $item->aspek_penilaian_count,
                ];
            })
            ->withQueryString();

        return ['data' => $data];
    }

    public function getFormData()
    {
        return [
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all(),
        ];
    }

    /**
     * Menyimpan data dan mengembalikan objek yang baru dibuat
     */
    public function store($validated)
    {
        // Return hasil create
        return Stase::create($validated);
    }

    public function getEditData($id)
    {
        return [
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all(),
            'stase' => Stase::findOrFail($id),
        ];
    }

    /**
     * Mengupdate data dan mengembalikan objek yang sudah diperbarui
     */
    public function update($validated, $id)
    {
        $stase = Stase::findOrFail($id);

        $stase->update($validated);

        // Return objek yang sudah di-refresh (untuk memastikan data terbaru)
        return $stase->refresh();
    }

    public function delete($id)
    {
        $stase = Stase::findOrFail($id);
        $stase->delete();
    }
}
