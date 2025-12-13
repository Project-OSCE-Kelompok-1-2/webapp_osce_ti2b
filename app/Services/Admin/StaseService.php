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
        // HAPUS return array wrapper, langsung return Collection
        return Stase::query()
            ->when($search, fn($q) => $q->where('nama_stase', 'like', "%{$search}%"))
            ->with(['tujuanPembelajaran'])
            ->withCount('aspekPenilaian')
            ->orderBy('created_at', 'desc') // Optional: Agar data terbaru diatas
            ->get(); // <--- PERBAIKAN: Gunakan get() agar semua data terkirim
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
            // 1. Buat Stase
            $stase = Stase::create([
                'nama_stase' => $validated['nama_stase'],
                'id_mata_kuliah' => $validated['id_mata_kuliah'],
                'deskripsi' => $validated['deskripsi'] ?? null,
            ]);

            // 2. Simpan Multi Tujuan Pembelajaran
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

            // 1. Update data dasar Stase
            $stase->update([
                'nama_stase' => $validated['nama_stase'],
                'id_mata_kuliah' => $validated['id_mata_kuliah'],
                'deskripsi' => $validated['deskripsi'] ?? null,
            ]);

            // 2. Sync Tujuan Pembelajaran (Hapus lama, insert baru)
            // Ini cara paling aman untuk memastikan data sinkron dengan UI
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
