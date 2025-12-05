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
        $query = Osce::query()->with('tahunAkademik'); 

        if ($request->has('search') && $request->search !== '') {
            $query->where('nama_osce', 'like', '%' . $request->search . '%');
        }
        
        if ($request->has('tahun') && $request->tahun !== '') {
            $query->whereHas('tahunAkademik', function ($q) use ($request) {
                $q->where('tahun', $request->tahun);
            });
        }

        $osceList = $query->orderBy('tanggal_mulai', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($osce) => [
                'id_osce' => $osce->id_osce,
                'nama_osce' => $osce->nama_osce,
                // [PENTING] Kirim ID Tahun Akademik untuk form Edit
                'id_tahun_akademik' => $osce->id_tahun_akademik, 
                // [PENTING] Format Y-m-d agar terbaca oleh <input type="date">
                'tanggal_mulai' => $osce->tanggal_mulai->format('Y-m-d'), 
                'tanggal_selesai' => $osce->tanggal_selesai->format('Y-m-d'),
                'tahun_akademik_string' => $osce->tahunAkademik->tahun ?? 'N/A',
                'detail_stase' => $osce->detail_stase ?? '0 Stase',
                'detail_mahasiswa' => $osce->detail_mahasiswa ?? '0 Mahasiswa',
                'detail_sesi' => $osce->detail_sesi ?? '0 Sesi',
            ]);

        // [PENTING] Ambil data tahun akademik untuk dropdown
        $tahunAkademikOptions = TahunAkademik::orderBy('tahun', 'desc')
            ->get()
            ->map(fn($t) => [
                'label' => $t->tahun . ' - ' . $t->semester,
                'value' => $t->id_tahun_akademik 
            ]);
            

        return Inertia::render('Admin/OsceListPage', [
            'osce' => $osceList,
            'filters' => $request->only(['search', 'tahun']),
            'tahunAkademikOptions' => $tahunAkademikOptions, // Kirim ke Frontend
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        Osce::create($validated);

        return Redirect::route('admin.osce.index')
            ->with('success', 'Data OSCE berhasil dibuat.');
    }

    public function edit(Osce $osce)
    {
        // Method ini mungkin jarang dipakai jika menggunakan Modal, 
        // tapi tetap disesuaikan logic-nya.
        $tahunAkademik = TahunAkademik::orderBy('tahun', 'desc')->get()->map(fn ($th) => [
            'value' => $th->id_tahun_akademik,
            'label' => $th->tahun . ' - ' . $th->semester,
        ]);

        return Inertia::render('Admin/TambahOsce', [ 
            'tahunAkademikOptions' => $tahunAkademik,
            'osce' => $osce,
        ]);
    }

    public function update(Request $request, Osce $osce)
    {
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