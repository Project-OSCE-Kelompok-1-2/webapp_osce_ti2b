<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Penguji;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Admin\PengujiService;
use Illuminate\Validation\Rule;

class PengujiController extends Controller
{
    protected $service;

    public function __construct(PengujiService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data penguji
     * */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $data = $this->service->getAll($search);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Membuat data penguji
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip'),
                Rule::unique('pengguna', 'username'),
            ],
        ]);

        $penguji = $this->service->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Penguji berhasil dibuat',
            'data' => $penguji,
        ], 201);
    }

    /**
     * Memperbarui data penguji
     */
    public function update(Request $request, Penguji $penguji)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => [
                'required',
                'string',
                'max:255',
                Rule::unique('penguji', 'nip')->ignore($penguji->id_penguji, 'id_penguji'),
                Rule::unique('pengguna', 'username')->ignore($penguji->id_pengguna, 'id_pengguna'),
            ],
        ]);

        $updated = $this->service->update($penguji, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Data penguji berhasil diperbarui',
            'data' => $updated,
        ]);
    }

    /**
     * Menghapus data penguji
     */
    public function destroy(Penguji $penguji)
    {
        $this->service->delete($penguji);

        return response()->json([
            'success' => true,
            'message' => 'Penguji berhasil dihapus',
        ]);
    }
}
