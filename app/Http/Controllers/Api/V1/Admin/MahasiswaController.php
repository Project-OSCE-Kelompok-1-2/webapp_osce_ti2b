<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Pengguna;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Services\MahasiswaService;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class MahasiswaController extends Controller
{
    protected $service;

    public function __construct(MahasiswaService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data mahasiswa
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $angkatan = $request->query('angkatan');

        $mahasiswa = $this->service->getAll($search, $angkatan);

        return response()->json([
            'status' => 'success',
            'data' => $mahasiswa,
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * Membuat data mahasiswa
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nim'   => [
                'required',
                'string',
                'max:20',
                'unique:mahasiswa,nim',
                function ($attribute, $value, $fail) {
                    if (Pengguna::where('username', $value)->exists()) {
                        $fail('NIM ini sudah digunakan sebagai username di tabel pengguna.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
        ]);

        $mahasiswa = $this->service->store($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahasiswa baru berhasil ditambahkan.',
            'data' => $mahasiswa
        ], 201);
    }

    /**
     * Mengambil data mahasiswa
     */
    public function show(Mahasiswa $mahasiswa)
    {
        $data = $this->service->getOne($mahasiswa);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * Memperbarui data mahasiswa
     */
    public function update(Request $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validate([
            'nim'   => [
                'required',
                'string',
                'max:20',
                'unique:mahasiswa,nim,' . $mahasiswa->id_mahasiswa . ',id_mahasiswa', // Abaikan diri sendiri
                function ($attribute, $value, $fail) use ($mahasiswa) {
                    if (Pengguna::where('username', $value)->where('id_pengguna', '!=', $mahasiswa->id_pengguna)->exists()) {
                        $fail('NIM ini sudah digunakan sebagai username oleh pengguna lain.');
                    }
                },
            ],
            'nama'  => 'required|string|max:255',
            'kelas' => 'required|string|max:50',
            'prodi' => 'required|string|max:100',
        ]);

        $updatedMahasiswa = $this->service->update($validated, $mahasiswa);

        return response()->json([
            'status' => 'success',
            'message' => 'Data mahasiswa berhasil diperbarui.',
            'data' => $updatedMahasiswa
        ]);
    }

    /**
     * Menghapus data mahasiswa
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $this->service->delete($mahasiswa);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahasiswa berhasil dihapus.'
        ]);
    }

    /**
     * Endpoint API untuk import data mahasiswa.
     * POST /api/admin/mahasiswa/import
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        // 1. Validasi Input (Sama persis dengan logika sebelumnya)
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        try {
            // 2. Panggil Service untuk eksekusi logika import
            $this->service->importMahasiswa($request->file('file'));

            // 3. Return Success JSON
            return response()->json([
                'status'  => 'success',
                'message' => 'Data mahasiswa berhasil diimpor.',
            ], 200);
        } catch (\Exception $e) {
            // 4. Return Error JSON jika import gagal
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengimpor data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
