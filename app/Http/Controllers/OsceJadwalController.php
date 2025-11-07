<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Osce;
use App\Models\OsceStase;       // Asumsi nama model
use App\Models\EnrollmentOsce;  // Asumsi nama model

class OsceJadwalController extends Controller
{
    /**
     * TASK 1: Menampilkan daftar Sesi (Jadwal) yang sudah di-grup
     * GET /admin/osce/{id_osce}/jadwal
     */
    public function index($id_osce)
    {
        // Ambil data OSCE untuk judul halaman, dll.
        $osce = Osce::findOrFail($id_osce);

        // Logika untuk membuat "Sesi" virtual
        // Kita mengambil OsceStase, lalu di-grup berdasarkan tanggal & jam mulai
        $sesi_virtual = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->select('tanggal', 'jam_mulai', DB::raw('count(*) as jumlah_stase_di_sesi_ini'))
            ->groupBy('tanggal', 'jam_mulai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // Logika untuk menghitung jumlah total mahasiswa
        $jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)->count();

        // Kirim semua data ke view
        return view('admin.osce.jadwal.index', [
            'osce' => $osce,
            'sesi_list' => $sesi_virtual,
            'total_mahasiswa' => $jumlah_mahasiswa,
        ]);
    }

    /**
     * TASK 2: Menyimpan data Jadwal/Sesi baru
     * POST /admin/osce/{id_osce}/jadwal
     */
    public function store(Request $request, $id_osce)
    {
        // Validasi input form
        // Catatan: Anda mungkin perlu validasi lain, misal jam_selesai, atau unique rule
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i', // Format jam misal: 08:00
            // 'id_stase' => 'required', // Mungkin Anda butuh ini?
            // 'id_ruang' => 'required', // Mungkin Anda butuh ini?
        ]);

        // Simpan entry baru
        // PERHATIAN: Logika ini mengasumsikan "Membuat Sesi" berarti menambah
        // SATU record OsceStase baru.
        // Jika "Membuat Sesi" berarti membuat BANYAK record (misal 10 stase sekaligus),
        // logikanya akan lebih kompleks (perlu loop).
        // Kita ikuti instruksi "menyimpan entry baru" (singular).

        try {
            $newEntry = new OsceStase();
            $newEntry->id_osce = $id_osce;
            $newEntry->tanggal = $validated['tanggal'];
            $newEntry->jam_mulai = $validated['jam_mulai'];
            
            // Tambahkan kolom lain dari form jika ada
            // $newEntry->id_stase = $request->input('id_stase');
            // $newEntry->id_ruang = $request->input('id_ruang');
            // $newEntry->id_penguji = $request->input('id_penguji');
            
            $newEntry->save();

            return redirect()->back()->with('success', 'Jadwal/Sesi baru berhasil ditambahkan.');

        } catch (\Exception $e) {
            // Tangani jika ada error, misal unique constraint violation
            return redirect()->back()->with('error', 'Gagal menyimpan jadwal: ' . $e->getMessage());
        }
    }

    // Anda mungkin butuh method 'create' untuk menampilkan form POST
    // GET /admin/osce/{id_osce}/jadwal/create
    public function create($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        // Anda mungkin perlu data lain (mis: list stase, list ruangan)
        return view('admin.osce.jadwal.create', ['osce' => $osce]);
    }
}