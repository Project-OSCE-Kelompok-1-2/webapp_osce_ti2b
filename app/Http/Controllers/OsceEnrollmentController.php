<?php

namespace App\Http\Controllers;

use App\Models\Osce;
use App\Models\Mahasiswa;
use App\Models\EnrollmentOsce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia; // Digunakan karena feature test mengindikasikan Inertia

class OsceEnrollmentController extends Controller
{
    /**
     * TUGAS 1: Menampilkan daftar Mahasiswa dan status Enrollment OSCE.
     * Endpoint: GET /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $osce_id
     * @param  int  $jadwal_id (Tidak digunakan, tapi tetap diterima sesuai rute)
     * @return \Inertia\Response
     */
    public function index(Request $request, int $osce_id, int $jadwal_id)
    {
        // 1. Ambil ID Mahasiswa yang sudah terdaftar di EnrollmentOsce untuk OSCE ini
        // Pluck hanya mengambil kolom 'id_mahasiswa' dan mengubahnya menjadi array biasa.
        $enrolled_mahasiswa_ids = EnrollmentOsce::where('id_osce', $osce_id)
                                                ->pluck('id_mahasiswa')
                                                ->toArray();
        
        // 2. Query SEMUA Mahasiswa
        $mahasiswa_query = Mahasiswa::query()
            ->select('id_mahasiswa', 'nim', 'nama', 'kelas', 'prodi'); // Pilih kolom yang relevan

        // Terapkan filter 'search' pada NAMA atau NIM
        if ($request->filled('search')) {
            $search = '%' . $request->input('search') . '%';
            $mahasiswa_query->where(function ($query) use ($search) {
                $query->where('nama', 'like', $search)
                      ->orWhere('nim', 'like', $search);
            });
        }

        // Terapkan filter 'angkatan'
        // Karena di model Mahasiswa tidak ada kolom 'angkatan', 
        // kita asumsikan 'angkatan' memfilter kolom 'prodi' atau 'kelas'
        if ($request->filled('angkatan')) {
            // Asumsi: angkatan merepresentasikan nilai di kolom 'prodi'
            $mahasiswa_query->where('prodi', $request->input('angkatan')); 
        }

        // Ambil data mahasiswa dan urutkan
        // Gunakan paginate untuk handling data besar (sesuai best practice Inertia)
        $mahasiswa_data = $mahasiswa_query->orderBy('nim')
                                          ->paginate(10); // Sesuaikan ukuran paginasi

        
        // 3. Gabungkan data dan komputasi 'is_enrolled'
        $mahasiswa_data->getCollection()->transform(function ($mahasiswa) use ($enrolled_mahasiswa_ids) {
            return [
                'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                // Logik is_enrolled: true jika ID mahasiswa ada di daftar yang sudah terdaftar
                'is_enrolled' => in_array($mahasiswa->id_mahasiswa, $enrolled_mahasiswa_ids),
            ];
        });

        // Kembalikan response Inertia
        return Inertia::render('Admin/OsceEnrollmentPage', [ 
            // Mengembalikan object pagination yang sudah di-transform
            'mahasiswa' => $mahasiswa_data,
            'osce_id' => $osce_id,
            'jadwal_id' => $jadwal_id,
            'filters' => $request->only(['search', 'angkatan']),
        ]);
    }

    /**
     * TUGAS 2: Menyimpan/Sync Enrollment OSCE.
     * Endpoint: POST /admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $osce_id
     * @param  int  $jadwal_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sync(Request $request, int $osce_id, int $jadwal_id)
    {
        // Validasi input
        $request->validate([
            'id_mahasiswa_array' => 'nullable|array',
            'id_mahasiswa_array.*' => 'integer|exists:mahasiswa,id_mahasiswa', // Pastikan ID valid
        ]);

        $mahasiswa_ids = $request->input('id_mahasiswa_array', []);
        
        // Gunakan Transaksi Database untuk menjamin atomisitas (Hapus dan Sisip harus berhasil semua)
        DB::beginTransaction();
        try {
            // 1. Hapus semua EnrollmentOsce yang ada untuk osce_id ini (Sync logic)
            EnrollmentOsce::where('id_osce', $osce_id)->delete();

            // 2. Siapkan data baru untuk di-INSERT
            $new_enrollments = [];
            $now = now();
            foreach ($mahasiswa_ids as $id_mahasiswa) {
                $new_enrollments[] = [
                    'id_osce' => $osce_id,
                    'id_mahasiswa' => $id_mahasiswa,
                    'catatan' => null, 
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // 3. INSERT data baru
            if (!empty($new_enrollments)) {
                // Gunakan insert untuk performa massal
                EnrollmentOsce::insert($new_enrollments);
            }

            DB::commit();

            // Sesuai feature test, harus redirect dan memiliki session success
            return redirect()->back()
                ->with('success', 'Daftar enrollment mahasiswa berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            // Log error untuk debugging
            \Log::error("OSCE Enrollment Sync Failed for OSCE ID {$osce_id}: " . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Gagal memperbarui enrollment mahasiswa. Silakan coba lagi.');
        }
    }
}