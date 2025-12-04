<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Services\OsceService;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class OsceController extends Controller
{
    protected $service;

    public function __construct(OsceService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $search = $request->query("search");
        $tahun = $request->query("tahun");

        $osceList = $this->service->getAll($search, $tahun);

        return Inertia::render('Admin/OsceListPage', [
            'osce' => $osceList['data'],
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        $this->service->store($validator);

        return Redirect::route('admin.osce.index')
            ->with('success', 'Data OSCE berhasil dibuat.');
    }

    public function edit(Osce $osce)
    {
        // Kirim data dropdown dan data osce yang ada
        $tahunAkademik = TahunAkademik::orderBy('tahun', 'desc')->get()->map(fn($th) => [
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
        $validator = Validator::make($request->all(), [
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => [
                'required',
                'string',
                'max:255',
                Rule::unique('osce')->ignore($osce->id_osce, 'id_osce')
            ],
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        $this->service->update($osce, $validator);

        return Redirect::route('admin.osce.index')->with('success', 'Data OSCE berhasil diperbarui.');
    }

    /**
     * Menghapus data OSCE.
     * DELETE /admin/osce/{osce}
     */
    public function destroy(Osce $osce)
    {
        try {
            $this->service->destroy($osce);
            return Redirect::back()->with('success', 'Data OSCE berhasil dihapus.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Gagal menghapus OSCE. Pastikan tidak ada data terkait.');
        }
    }
}
