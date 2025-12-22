<?php

namespace App\Services\Admin;

use App\Models\Stase;
use App\Models\MataKuliah;
use App\Models\TujuanPembelajaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class StaseService
{
    public function getAll($search)
    {
        return Stase::query()
            ->when($search, fn($q) => $q->where('nama_stase', 'like', "%{$search}%"))
            ->with(['tujuanPembelajaran'])
            ->withCount('aspekPenilaian')
            ->orderBy('created_at', 'desc') 
            ->get(); 
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
        return DB::transaction(function () use ($validated) {
            $stase = Stase::create([
                'nama_stase' => $validated['nama_stase'],
                'id_mata_kuliah' => $validated['id_mata_kuliah'],
                'deskripsi' => $validated['deskripsi'] ?? null,
            ]);

            foreach ($validated['tujuan_pembelajaran'] as $tujuanText) {
                $stase->tujuanPembelajaran()->create([
                    'tujuan' => $tujuanText
                ]);
            }

            return $stase;
        });
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
        return DB::transaction(function () use ($validated, $id) {
            $stase = Stase::findOrFail($id);

            $stase->update([
                'nama_stase' => $validated['nama_stase'],
                'id_mata_kuliah' => $validated['id_mata_kuliah'],
                'deskripsi' => $validated['deskripsi'] ?? null,
            ]);

            $stase->tujuanPembelajaran()->delete();

            foreach ($validated['tujuan_pembelajaran'] as $tujuanText) {
                $stase->tujuanPembelajaran()->create([
                    'tujuan' => $tujuanText
                ]);
            }

            return $stase->refresh();
        });
    }

    public function delete($id)
    {
        $stase = Stase::findOrFail($id);
        $stase->delete();
    }
}
