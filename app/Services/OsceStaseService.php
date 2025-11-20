<?php

namespace App\Services;

use App\Models\Osce;
use App\Models\OsceStase;
use Illuminate\Support\Facades\DB;

class OsceStaseService
{
    /**
     * Helper private untuk memformat output data agar konsisten
     * antara getAll, store, dan update.
     */
    private function formatItem($item)
    {
        return [
            "id_osce_stase" => $item->id_osce_stase,
            "ruang" => [
                "id_ruang" => $item->ruang->id_ruang ?? null, // Tambahkan ID jika butuh untuk edit
                "nomor_ruangan" => $item->ruang->nomor_ruangan ?? null,
            ],
            "stase" => [
                "id_stase" => $item->stase->id_stase ?? null,
                "nama_stase" => $item->stase->nama_stase ?? null,
            ],
            "penguji" => [
                "id_penguji" => $item->penguji->id_penguji ?? null,
                "nama" => $item->penguji->nama ?? null,
            ],
        ];
    }

    /**
     * Ambil daftar osce_stase (template saja)
     */
    public function getAll($id_osce, $search = null)
    {
        $osce = Osce::findOrFail($id_osce);

        $query = OsceStase::where("id_osce", $id_osce)
            ->whereNull("tanggal") // hanya template
            ->with(["ruang", "penguji", "stase"]);

        if ($search) {
            $query->whereHas("stase", function ($q) use ($search) {
                $q->where("nama_stase", "like", "%$search%");
            });
        }

        // Menggunakan formatItem agar konsisten
        $result = $query->paginate(10)->through(function ($item) {
            return $this->formatItem($item);
        });

        return [
            "success" => true,
            "message" => "Data osce stase berhasil diambil.",
            "data" => $result
        ];
    }

    /**
     * Tambah stase template
     */
    public function store($id_osce, $data)
    {
        $newStase = OsceStase::create([
            "id_osce" => $id_osce,
            "id_ruang" => $data["id_ruang"],
            "id_stase" => $data["id_stase"],
            "id_penguji" => $data["id_penguji"],
        ]);

        // Load relasi agar data yang dikembalikan lengkap (nama ruang, nama penguji, dll)
        $newStase->load(["ruang", "penguji", "stase"]);

        return [
            "success" => true,
            "message" => "Stase berhasil ditambahkan.",
            "data" => $this->formatItem($newStase) // Kembalikan data terformat
        ];
    }

    /**
     * Update stase template
     */
    public function update($id_osce, OsceStase $osce_stase, $data)
    {
        $osce_stase->update([
            "id_ruang" => $data["id_ruang"],
            "id_stase" => $data["id_stase"],
            "id_penguji" => $data["id_penguji"],
        ]);

        // Refresh dan load relasi terbaru
        $osce_stase->refresh();
        $osce_stase->load(["ruang", "penguji", "stase"]);

        return [
            "success" => true,
            "message" => "Stase berhasil diperbarui.",
            "data" => $this->formatItem($osce_stase) // Kembalikan data terformat
        ];
    }

    /**
     * Hapus template dan semua sesi terkait
     */
    public function destroy($id_osce, $id_osce_stase)
    {
        DB::beginTransaction();
        try {
            $template = OsceStase::where("id_osce", $id_osce)
                ->where("id_osce_stase", $id_osce_stase)
                ->whereNull("tanggal")
                ->firstOrFail();

            OsceStase::where("id_osce", $template->id_osce)
                ->where("id_stase", $template->id_stase)
                ->where("id_ruang", $template->id_ruang)
                ->where("id_penguji", $template->id_penguji)
                ->delete();

            DB::commit();

            return [
                "success" => true,
                "message" => "Stase dan semua sesi terkait berhasil dihapus.",
                "data" => null
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                "success" => false,
                "message" => "Gagal menghapus stase: " . $e->getMessage(),
                "data" => null
            ];
        }
    }
}
