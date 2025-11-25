<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Foto;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\AuthService; // <-- Jika AuthService TIDAK digunakan, hapus saja.

class FotoController extends Controller
{
    public function create_foto(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Batas 2MB
            'nama' => 'required|string|max:255', // Ditambahkan max length yang umum
            'deskripsi' => 'nullable|string', // Diubah menjadi nullable jika deskripsi boleh kosong
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validasi Gagal",
                "errors" => $validator->errors()
            ], 422);
        }

        // Ambil Data yang Sudah Divalidasi
        $validatedData = $validator->validated();

        // 2. Simpan File Foto ke Storage
        // Kita tahu file ada dan valid karena sudah lolos validasi
        $file = $request->file('foto');

        // Simpan file ke direktori 'public/foto' dan ambil path-nya.
        // store() akan otomatis membuat nama file unik (hashed name).
        $path = $file->store('public/foto');

        // 3. Simpan Path dan Data ke Database
        // Akses data non-file dari array $validatedData, BUKAN dari $validator->nama.
        Foto::create([
            'foto' => Storage::url($path),
            'nama' => $validatedData['nama'], // Akses data nama dari array
            'deskripsi' => $validatedData['deskripsi'] ?? null, // Akses deskripsi
            // Tambahkan kolom lain jika diperlukan, seperti 'user_id' => auth()->id(),
        ]);

        // 4. Berikan Respons Sukses
        return response()->json([
            "success" => true,
            "message" => "Foto berhasil dibuat dan disimpan"
        ], 201); // 201 Created
    }
}
