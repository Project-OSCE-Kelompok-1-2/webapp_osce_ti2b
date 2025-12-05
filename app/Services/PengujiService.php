<?php

namespace App\Services;

use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Support\Facades\DB;

class PengujiService
{
    /** GET LIST + FILTER */
    public function getAll($search = null, )
    {
        $query = Penguji::query();
        $perPage = 10;

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%$search%")
                    ->orWhere('nip', 'LIKE', "%$search%");
            });
        }

        return $query->orderBy('nama')
            ->paginate($perPage)
            ->through(fn($d) => [
                'id_penguji' => $d->id_penguji,
                'nip' => $d->nip,
                'nama' => $d->nama,
            ]);
    }

    /** STORE */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $pengguna = Pengguna::create([
                'username' => $data['nip'],
                'password' => $data['nip'],
                'jenis_role' => 'penguji',
            ]);

            $penguji = Penguji::create([
                'nama' => $data['nama'],
                'nip' => $data['nip'],
                'id_pengguna' => $pengguna->id_pengguna,
            ]);

            return $penguji;
        });
    }

    /** UPDATE */
    public function update(Penguji $penguji, array $data)
    {
        return DB::transaction(function () use ($penguji, $data) {

            $penguji->update([
                'nama' => $data['nama'],
                'nip' => $data['nip'],
            ]);

            if ($penguji->pengguna) {
                $penguji->pengguna->update([
                    'username' => $data['nip'],
                ]);
            }

            return $penguji;
        });
    }

    /** DELETE */
    public function delete(Penguji $penguji)
    {
        return DB::transaction(function () use ($penguji) {

            if ($penguji->pengguna) {
                $penguji->pengguna->delete();
            }

            return $penguji->delete();
        });
    }
}
