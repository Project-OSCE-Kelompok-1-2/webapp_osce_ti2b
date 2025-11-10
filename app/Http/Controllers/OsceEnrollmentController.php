<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Osce;
use App\Models\OsceStase; // <-- Perlu ini untuk referensi sesi
use App\Models\Mahasiswa;
use App\Models\EnrollmentOsce;
use Inertia\Inertia;

class OsceEnrollmentController extends Controller
{
    /**
     * TUGAS 1: Menampilkan halaman enrollment (PERBAIKAN)
     * GET /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     */
    public function index(Request $request, $osce_id, $jadwal_id)
    {
        // 1. Ambil data OSCE
        $osce = Osce::findOrFail($osce_id);

        // 2. [FIX] Cari data Sesi (tanggal/jam) dari $jadwal_id
        //    ($jadwal_id adalah MIN(id_osce_stase) dari sesi tersebut)
        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
                        ->where('id_osce_stase', $jadwal_id)
                        ->firstOrFail();

        // 3. Ambil data filter
        $search = $request->query('search');
        $angkatan = $request->query('angkatan'); // 'angkatan' di React = 'kelas' di DB

        // 4. Ambil SEMUA mahasiswa (dengan filter)
        $mahasiswa_query = Mahasiswa::query();
        if ($search) {
            $mahasiswa_query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%");
            });
        }
        if ($angkatan) {
            // Sesuai konteks, 'angkatan' di form memfilter 'kelas' di DB
            $mahasiswa_query->where('kelas', $angkatan); 
        }

        // 5. [FIX] Ambil ID mahasiswa yang SUDAH terdaftar di SESI INI
        $enrolled_ids = EnrollmentOsce::where('id_osce', $osce_id)
            ->where('tanggal_sesi', $sesi_ref->tanggal) // <-- Filter berdasarkan sesi
            ->where('jam_sesi', $sesi_ref->jam_mulai)   // <-- Filter berdasarkan sesi
            ->pluck('id_mahasiswa')
            ->all();

        // 6. Paginate mahasiswa dan tambahkan properti 'is_enrolled'
        $mahasiswa_list = $mahasiswa_query->orderBy('nama', 'asc')
            ->paginate(20) // Anda bisa sesuaikan jumlah ini
            ->through(fn ($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                'is_enrolled' => in_array($mhs->id_mahasiswa, $enrolled_ids) // Cek
            ])->withQueryString();

        // 7. [FIX] Kirim props yang benar ke React
        return Inertia::render('Admin/OsceEnrollmentPage', [
            'osce' => $osce,
            'sesi' => $sesi_ref, // Berisi tanggal & jam_mulai
            'mahasiswa_list' => $mahasiswa_list, // Nama prop yang benar
            'filters' => ['search' => $search, 'angkatan' => $angkatan],
        ]);
    }

    /**
     * TUGAS 2: Menyimpan (sync) data enrollment (PERBAIKAN)
     * POST /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     */
    public function sync(Request $request, $osce_id, $jadwal_id)
    {
        // 1. Validasi
        $validated = $request->validate([
            'id_mahasiswa_array' => 'present|array', // 'present' berarti boleh kosong
            'id_mahasiswa_array.*' => 'integer|exists:mahasiswa,id_mahasiswa',
        ]);
        
        $mahasiswa_ids = $validated['id_mahasiswa_array'];

        // 2. [FIX] Ambil data Sesi (tanggal/jam) dari $jadwal_id
        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
                        ->where('id_osce_stase', $jadwal_id)
                        ->firstOrFail();

        DB::beginTransaction();
        try {
            // 3. [FIX] Hapus semua enrollment LAMA HANYA untuk sesi ini
            EnrollmentOsce::where('id_osce', $osce_id)
                ->where('tanggal_sesi', $sesi_ref->tanggal) // <-- Filter berdasarkan sesi
                ->where('jam_sesi', $sesi_ref->jam_mulai)   // <-- Filter berdasarkan sesi
                ->delete();

            // 4. [FIX] Buat data baru untuk di-insert (dengan data sesi)
            $data_to_insert = [];
            $now = now();
            foreach ($mahasiswa_ids as $id_mhs) {
                $data_to_insert[] = [
                    'id_osce' => $osce_id,
                    'id_mahasiswa' => $id_mhs,
                    'tanggal_sesi' => $sesi_ref->tanggal, // <-- Simpan data sesi
                    'jam_sesi' => $sesi_ref->jam_mulai,   // <-- Simpan data sesi
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // 5. Insert data BARU
            if (!empty($data_to_insert)) {
                EnrollmentOsce::insert($data_to_insert);
            }

            DB::commit();
            
            // [PERBAIKAN] Redirect ke halaman list jadwal, bukan back()
            return redirect()->route('admin.osce.jadwal.index', $osce_id)
                             ->with('success', 'Enrollment mahasiswa berhasil disimpan!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan enrollment: ' . $e->getMessage());
        }
    }
}