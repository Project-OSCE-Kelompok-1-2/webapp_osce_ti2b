<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\OsceStase;
// Model tambahan yang diperlukan
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class OsceJadwalController extends Controller
{
    /**
     * Menampilkan daftar Sesi (Jadwal) yang sudah di-grup
     * GET /admin/osce/{id_osce}/jadwal
     */
    public function index(Request $request, $id_osce) 
    {
        // Ambil data OSCE untuk judul halaman, dll.
        $osce = Osce::findOrFail($id_osce);
        
        // Ambil 'search' dari query parameter
        $search = $request->query('search');

        // Buat query dasar
        $sesi_virtual_query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal') 
            ->select('tanggal', 'jam_mulai', DB::raw('MIN(id_osce_stase) as id_osce_stase'))
            ->groupBy('tanggal', 'jam_mulai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc');

        // Terapkan filter 'search' jika ada
        if ($search) {
            $sesi_virtual_query->where('tanggal', 'like', "%{$search}%");
        }

        // [DIHAPUS] Jangan hitung total di sini
        // $jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)->count();

        // Eksekusi query dengan PAGINATE
        $sesi_paginated = $sesi_virtual_query->paginate(10)->withQueryString();

        // [PERBAIKAN] Gunakan 'through()' untuk inject data PER SESI
        $sesi_data = $sesi_paginated->through(function ($sesi) use ($id_osce) { // <-- Ubah 'use'
            
            // [PERBAIKAN] Hitung jumlah mahasiswa HANYA untuk sesi ini
            $sesi->jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi->tanggal) // <-- Filter berdasarkan tanggal sesi
                ->where('jam_sesi', $sesi->jam_mulai)   // <-- Filter berdasarkan jam sesi
                ->count();
            
            // Format tanggal agar lebih rapi di React
            $sesi->tanggal_formatted = (new \DateTime($sesi->tanggal))->format('d M Y');
            // Format jam (hapus detik)
            $sesi->jam_mulai_formatted = substr($sesi->jam_mulai, 0, 5);

            return $sesi;
        });
        
        // Kirim data paginasi ('sesi_data') dan 'filters'
        return Inertia::render('Admin/OsceJadwalPage', [
            'osce' => $osce,
            'sesi' => $sesi_data, // Prop 'sesi' sekarang berisi objek paginasi
            'filters' => ['search' => $search] // Kirim 'filters' ke React
        ]);
    }

    /**
     * Menyimpan data Jadwal/Sesi baru
     * POST /admin/osce/{id_osce}/jadwal
     */
    public function store(Request $request, $id_osce)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        DB::beginTransaction();
        try {
            // Loop melalui ID stase (template) yang dipilih
            foreach ($validated['stase_ids'] as $template_stase_id) {
                
                // Cari template stase. (Bisa stase null atau stase dari sesi lain)
                $template = OsceStase::find($template_stase_id);

                if ($template) {
                    // Duplikasi/Copy template
                    $new_sesi_stase = $template->replicate(); 
                    
                    // Terapkan jadwal BARU pada salinan
                    $new_sesi_stase->tanggal = $validated['tanggal'];
                    $new_sesi_stase->jam_mulai = $validated['jam_mulai'];
                    $new_sesi_stase->jam_selesai = $validated['jam_selesai'];
                    
                    // Simpan salinan sebagai baris BARU
                    $new_sesi_stase->save();
                }
            }
            
            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi berhasil dibuat!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan jadwal: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan form untuk membuat jadwal baru
     * GET /admin/osce/{id_osce}/jadwal/create
     */
    public function create($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        
        // [PERBAIKAN] Ambil HANYA stase template (yang tanggalnya null)
        $stase_options = OsceStase::where('id_osce', $id_osce) 
            ->whereNull('tanggal') // <-- INI KUNCINYA
            ->with(['stase', 'ruang', 'penguji'])
            ->get()
            ->map(fn ($item) => [
                'value' => $item->id_osce_stase,
                'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
            ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'stase_options' => $stase_options,
            'sesi' => null,
            'stase_terpilih' => [],
        ]);
    }

    /**
     * Menampilkan form untuk EDIT jadwal sesi
     * GET /admin/osce/{id_osce}/jadwal/{sesi_id}/edit
     */
    public function edit($id_osce, $sesi_id)
    {
        $osce = Osce::findOrFail($id_osce);
        
        list($tanggal, $jam_mulai_full) = explode('_', $sesi_id); 

        $sesi_data = OsceStase::where('id_osce', $id_osce)
                        ->where('tanggal', $tanggal)
                        ->where('jam_mulai', $jam_mulai_full)
                        ->select('tanggal', 'jam_mulai', 'jam_selesai')
                        ->first();

        if (!$sesi_data) {
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                             ->with('error', 'Sesi tidak ditemukan.');
        }

        $tanggal_formatted = (new \DateTime($sesi_data->tanggal))->format('Y-m-d');

        $sesi = (object)[
            'tanggal' => $tanggal_formatted,
            'jam_mulai' => substr($sesi_data->jam_mulai, 0, 5),
            'jam_selesai' => substr($sesi_data->jam_selesai, 0, 5),
            'jam_mulai_full' => $sesi_data->jam_mulai,
        ];

        // 1. [PERBAIKAN] Ambil HANYA stase template (tanggal null)
        // Ini akan menjadi daftar checklist
        $stase_options = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal') // <-- INI KUNCINYA
            ->with(['stase', 'ruang', 'penguji'])
            ->get();

        // 2. Ambil stase (salinan) yang ada di sesi ini
        $stase_in_session = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('id_stase', 'id_penguji', 'id_ruang') // Pilih konfigurasinya
            ->get();
        
        // 3. Tentukan template mana yang harus diceklis
        $stase_terpilih_ids = [];
        
        foreach ($stase_options as $template) {
            // Cek apakah ada stase di sesi ini yang konfigurasinya
            // sama dengan template ini
            $is_selected = $stase_in_session->first(function ($session_instance) use ($template) {
                return $session_instance->id_stase === $template->id_stase &&
                       $session_instance->id_penguji === $template->id_penguji &&
                       $session_instance->id_ruang === $template->id_ruang;
            });

            if ($is_selected) {
                // Jika ya, tambahkan ID TEMPLATE ke daftar ceklis
                $stase_terpilih_ids[] = $template->id_osce_stase;
            }
        }

        // 4. Format opsi untuk React
        $stase_options_formatted = $stase_options->map(fn ($item) => [
            'value' => $item->id_osce_stase,
            'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
        ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'sesi' => $sesi,
            'stase_options' => $stase_options_formatted,
            'stase_terpilih' => array_unique($stase_terpilih_ids), // Kirim ID template yg diceklis
        ]);
    }

    /**
     * Mengupdate jadwal sesi yang sudah ada
     * PUT /admin/osce/{id_osce}/jadwal/{sesi_id}
     */
    public function update(Request $request, $id_osce, $sesi_id)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        list($old_tanggal, $old_jam_mulai) = explode('_', $sesi_id);

        DB::beginTransaction();
        try {
            // 1. HAPUS semua baris stase yang terikat pada sesi LAMA
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $old_tanggal)
                ->where('jam_mulai', $old_jam_mulai)
                ->delete(); // Ganti dari update() menjadi delete()

            // 2. BUAT BARU (Replicate) dari template stase yang dipilih
            foreach ($validated['stase_ids'] as $template_stase_id) {
                $template = OsceStase::find($template_stase_id);
                if ($template) {
                    $new_sesi_stase = $template->replicate(); 
                    
                    // Terapkan jadwal BARU pada salinan
                    $new_sesi_stase->tanggal = $validated['tanggal'];
                    $new_sesi_stase->jam_mulai = $validated['jam_mulai'];
                    $new_sesi_stase->jam_selesai = $validated['jam_selesai'];
                    
                    // Simpan salinan sebagai baris BARU
                    $new_sesi_stase->save();
                }
            }
            
            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi berhasil diperbarui!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui jadwal: ' . $e->getMessage());
        }
    }


    /**
     * Menghapus (me-reset) jadwal sesi
     * DELETE /admin/osce/{id_osce}/jadwal/{sesi_id}
     */
    public function destroy($id_osce, $sesi_id)
    {
        list($tanggal, $jam_mulai) = explode('_', $sesi_id);

        // Cari semua OsceStase yang cocok dan HAPUS
        OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai)
            ->delete(); // Ganti dari update() menjadi delete()

        return redirect()->route('admin.osce.jadwal.index', $id_osce)
            ->with('success', 'Jadwal sesi berhasil dihapus.');
    }
}