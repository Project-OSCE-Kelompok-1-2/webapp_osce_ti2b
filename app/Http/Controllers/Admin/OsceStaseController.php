<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\OsceStase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class OsceStaseController extends Controller
{
    public function index(Request $request, $id_osce)
    {
        // Ambil query parameter 'search'
        $search = $request->query('search');

        $osce = Osce::findOrFail($id_osce);

        // Query dasar
        $query = OsceStase::where("id_osce", $id_osce)
            // [PERBAIKAN] HANYA ambil stase template (yang belum dijadwalkan)
            ->whereNull('tanggal') 
            ->with(["ruang", "penguji", "stase"]);

        // Jika ada parameter 'search', tambahkan filter
        if ($search) {
            $query->whereHas('stase', function ($q) use ($search) {
                $q->where('nama_stase', 'like', '%' . $search . '%');
            });
        }

        // Ambil hasil (boleh pakai get() atau paginate())
        $osce_stase = $query->paginate(10)->through(function ($item) {
            return [
                'id_osce_stase' => $item->id_osce_stase,
                'ruang' => [
                    'nomor_ruangan' => $item->ruang->nomor_ruangan ?? null,
                ],
                'stase' => [
                    'nama_stase' => $item->stase->nama_stase ?? null,
                ],
                'penguji' => [
                    'nama' => $item->penguji->nama ?? null,
                ],
            ];
        })->withQueryString();

        // Kirim ke React dengan props tambahan 'filters' agar bisa diingat
        return Inertia::render("Admin/OsceStasePage", [
            'stase' => $osce_stase,
            'osce' => $osce,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

public function create($id_osce)
{
    // 1. Ambil data OSCE saat ini
    $osce = Osce::findOrFail($id_osce);

    // 2. [METODE OPTIMAL] Ambil HANYA kolom yang perlu,
    //    lalu format dengan 'map'
    
    $ruanganOptions = Ruang::select('id_ruang', 'nomor_ruangan')
        ->get()
        ->map(fn($ruang) => [
            'value' => $ruang->id_ruang,
            'label' => $ruang->nomor_ruangan,
        ]);

    $staseOptions = Stase::select('id_stase', 'nama_stase')
        ->get()
        ->map(fn($stase) => [
            'value' => $stase->id_stase,
            'label' => $stase->nama_stase,
        ]);

    $pengujiOptions = Penguji::select('id_penguji', 'nama')
        ->get()
        ->map(fn($penguji) => [
            'value' => $penguji->id_penguji,
            'label' => $penguji->nama,
        ]);

    // 3. Render halaman form React (Nama file sudah benar)
    return Inertia::render("Admin/TambahOsceStase", [
        'osce' => $osce,
        'ruanganOptions' => $ruanganOptions,
        'staseOptions'   => $staseOptions,
        'pengujiOptions' => $pengujiOptions,
    ]);
}


    public function store(Request $request, $id_osce)
{
    // Validasi input dulu
    $validated = $request->validate([
        'id_ruang' => 'required|exists:ruang,id_ruang',
        'id_stase' => 'required|exists:stase,id_stase',
        'id_penguji' => 'required|exists:penguji,id_penguji',
    ]);

    // Simpan data ke database
    OsceStase::create([
        'id_ruang' => $validated['id_ruang'],
        'id_stase' => $validated['id_stase'],
        'id_penguji' => $validated['id_penguji'],
        'id_osce' => $id_osce,
    ]);

    // [PERBAIKAN] Redirect ke halaman index (daftar stase)
    return Redirect::route('admin.osce.stase.index', ['id_osce' => $id_osce])
        ->with('success', 'Stase berhasil ditambahkan ke OSCE!');
}

    public function edit($id_osce, OsceStase $osce_stase)
    {
        // 1. Ambil data OSCE saat ini
        $osce = Osce::findOrFail($id_osce);

        // 2. Ambil data master untuk dropdown (sama seperti create)
        $ruanganOptions = Ruang::select('id_ruang', 'nomor_ruangan')
            ->get()->map(fn($r) => ['value' => $r->id_ruang, 'label' => $r->nomor_ruangan]);
            
        $staseOptions = Stase::select('id_stase', 'nama_stase')
            ->get()->map(fn($s) => ['value' => $s->id_stase, 'label' => $s->nama_stase]);

        $pengujiOptions = Penguji::select('id_penguji', 'nama')
            ->get()->map(fn($p) => ['value' => $p->id_penguji, 'label' => $p->nama]);

        // 3. Render halaman form, TAPI kirimkan data stase yang mau diedit
        return Inertia::render("Admin/TambahOsceStase", [
            'osce' => $osce,
            'stase_template' => $osce_stase, // Kirim data stase yg mau diedit
            'ruanganOptions' => $ruanganOptions,
            'staseOptions'   => $staseOptions,
            'pengujiOptions' => $pengujiOptions,
        ]);
    }

    public function update(Request $request, $id_osce, OsceStase $osce_stase)
    {
        // 1. Validasi
        $validated = $request->validate([
            'id_ruang' => 'required|exists:ruang,id_ruang',
            'id_stase' => 'required|exists:stase,id_stase',
            'id_penguji' => 'required|exists:penguji,id_penguji',
        ]);

        // 2. Update data stase template
        $osce_stase->update($validated);

        // 3. Redirect kembali ke halaman index stase
        return Redirect::route('admin.osce.stase.index', ['id_osce' => $id_osce])
            ->with('success', 'Stase berhasil diperbarui.');
    }

    public function destroy($id_osce, $id_osce_stase)
    {
        DB::beginTransaction();
        try {
            // 1. Cari template stase
            $template = OsceStase::where('id_osce', $id_osce)
                            ->where('id_osce_stase', $id_osce_stase)
                            ->whereNull('tanggal') // Pastikan ini template
                            ->firstOrFail();

            // 2. Hapus template DAN semua salinan sesinya
            //    (cocokkan berdasarkan konfigurasi)
            OsceStase::where('id_osce', $template->id_osce)
                ->where('id_stase', $template->id_stase)
                ->where('id_ruang', $template->id_ruang)
                ->where('id_penguji', $template->id_penguji)
                ->delete();

            DB::commit();
            
            return Redirect::back()->with('success', 'Stase dan semua sesi terkait berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus stase: ' . $e->getMessage());
        }
    }
}
