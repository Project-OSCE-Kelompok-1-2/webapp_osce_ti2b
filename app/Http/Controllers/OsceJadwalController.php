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

    

    // Anda mungkin butuh method 'create' untuk menampilkan form POST
    // GET /admin/osce/{id_osce}/jadwal/create
    public function create($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        // Anda mungkin perlu data lain (mis: list stase, list ruangan)
        return view('admin.osce.jadwal.create', ['osce' => $osce]);
    }
}