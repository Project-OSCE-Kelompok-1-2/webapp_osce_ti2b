<?php

namespace App\Services;

use App\Models\Stase;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class StaseService
{
    public function getAll(Request $request)
    {
        $data = Stase::query()
            ->when($request->input('search'), function ($q, $search) {
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

    public function store(Request $request)
    {
        $request->validate([
            'nama_stase' => 'required|string|max:255|unique:stase,nama_stase',
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran',
            'deskripsi' => 'nullable|string',
        ]);

        Stase::create($request->all());
    }

    public function getEditData($id)
    {
        return [
            'mataKuliah' => MataKuliah::all(),
            'tujuanPembelajaran' => TujuanPembelajaran::all(),
            'stase' => Stase::findOrFail($id),
        ];
    }

    public function update(Request $request, $id)
    {
        $stase = Stase::findOrFail($id);

        $request->validate([
            'nama_stase' => [
                'required',
                'string',
                'max:255',
                Rule::unique('stase', 'nama_stase')->ignore($id, 'id_stase'),
            ],
            'id_mata_kuliah' => 'required|exists:mata_kuliah,id_mata_kuliah',
            'id_tujuan_pembelajaran' => 'required|exists:tujuan_pembelajaran,id_tujuan_pembelajaran',
            'deskripsi' => 'nullable|string',
        ]);

        $stase->update($request->all());
    }

    public function delete($id)
    {
        $stase = Stase::findOrFail($id);
        $stase->delete();
    }
}
