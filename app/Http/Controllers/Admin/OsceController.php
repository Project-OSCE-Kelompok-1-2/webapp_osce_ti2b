<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class OsceController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Osce::query()->with('tahunAkademik'); // [REKOMENDASI] Tambah eager loading

        if ($request->has('search') && $request->search !== '') {
            // [PERBAIKAN] Ganti 'nama' -> 'nama_osce'
            $query->where('nama_osce', 'like', '%' . $request->search . '%');
        }
        
        // [REKOMENDASI] Tambah filter tahun
        if ($request->has('tahun') && $request->tahun !== '') {
            $query->whereHas('tahunAkademik', function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
            });
        }

        $osceList = $query->orderBy('tanggal_mulai', 'desc')
            ->paginate(10)
            ->withQueryString()
            // [PERBAIKAN] Format data sesuai Props Contract
            ->through(fn ($osce) => [
                'id_osce' => $osce->id_osce,
                'nama_osce' => $osce->nama_osce,
                'tanggal_mulai' => $osce->tanggal_mulai->format('d-m-Y'),
                'tanggal_selesai' => $osce->tanggal_selesai->format('d-m-Y'),
                'tahun_akademik_string' => $osce->tahunAkademik->tahun ?? 'N/A',
                // Accessor dari Model (jika ada)
                'detail_stase' => $osce->detail_stase ?? '0 Stase',
                'detail_mahasiswa' => $osce->detail_mahasiswa ?? '0 Mahasiswa',
                'detail_sesi' => $osce->detail_sesi ?? '0 Sesi',
            ]);

        return Inertia::render('Admin/OsceListPage', [
            'osce' => $osceList,
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }
    

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            // [PERBAIKAN] Ganti 'id' -> 'id_tahun_akademik' (sesuai form)
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            // [PERBAIKAN] Ganti 'nama' -> 'nama_osce'
            'nama_osce' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            // 'keterangan' => 'nullable|string', // Keterangan tidak ada di form Anda
        ]);

        Osce::create($validated);

        return Redirect::route('admin.osce.index')
            ->with('success', 'Data OSCE berhasil dibuat.');
    }

    public function edit(Osce $osce)
    {
        // Kirim data dropdown dan data osce yang ada
        $tahunAkademik = TahunAkademik::orderBy('tahun', 'desc')->get()->map(fn ($th) => [
            'value' => $th->id_tahun_akademik,
            'label' => $th->tahun . ' - ' . $th->semester,
        ]);

        return Inertia::render('Admin/TambahOsce', [ // Menggunakan form yang sama
            'tahunAkademikOptions' => $tahunAkademik,
            'osce' => $osce, // Kirim data OSCE yang akan diedit
        ]);
    }

    /**
     * Memperbarui data OSCE.
     * PUT /admin/osce/{osce}
     */
    public function update(Request $request, Osce $osce)
    {
        // Validasi sama seperti store, tapi 'nama_osce' boleh sama dengan dirinya sendiri
        $validated = $request->validate([
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => [
                'required', 'string', 'max:255',
                 Rule::unique('osce')->ignore($osce->id_osce, 'id_osce')
            ],
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        $osce->update($validated);

        return Redirect::route('admin.osce.index')->with('success', 'Data OSCE berhasil diperbarui.');
    }

    /**
     * Menghapus data OSCE.
     * DELETE /admin/osce/{osce}
     */
    public function destroy(Osce $osce)
    {
        try {
            
            $osce->delete();

            return Redirect::back()->with('success', 'Data OSCE berhasil dihapus.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Gagal menghapus OSCE. Pastikan tidak ada data terkait.');
        }
    }
}