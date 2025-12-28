<?php

namespace App\Services\Admin;

use App\Models\Penguji;
use App\Models\Pengguna;
use Illuminate\Support\Facades\DB;

class PengujiService
{
    public function getAll($search = null,)
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

    public function update(Penguji $penguji, $validated)
    {
        return DB::transaction(function () use ($penguji, $validated) {

            $penguji->update($validated);

            if ($penguji->pengguna) {
                $penguji->pengguna->update([
                    'username' => $validated['nip'],
                ]);
            }
            return $penguji;
        });
    }

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
