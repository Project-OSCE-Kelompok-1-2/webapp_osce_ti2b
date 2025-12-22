<?php

namespace App\Http\Controllers\Admin;

use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\Admin\OsceEnrollmentService;
use App\Models\OsceStase;

class OsceEnrollmentController extends Controller
{
    protected $service;
    public function __construct(OsceEnrollmentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, $osce_id, $jadwal_id)
    {
        $osce = Osce::findOrFail($osce_id);

        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
            ->where('id_osce_stase', $jadwal_id)
            ->firstOrFail();
        $search = $request->query('search');
        $angkatan = $request->query('angkatan'); 

        $mahasiswa_list = $this->service->getEnrollmentList(
            $osce_id,
            $jadwal_id,
            $request->only(['search', 'angkatan'])
        );
        return Inertia::render('Admin/OsceEnrollmentPage', [
            'osce' => $osce,
            'sesi' => $sesi_ref,
            'mahasiswa_list' => $mahasiswa_list["data"], 
            'filters' => ['search' => $search, 'angkatan' => $angkatan],
        ]);
    }

    public function sync(Request $request, $osce_id, $jadwal_id)
    {
        $validated = $request->validate([
            'id_mahasiswa_array' => 'present|array', 
            'id_mahasiswa_array.*' => 'integer|exists:mahasiswa,id_mahasiswa',
        ]);

        $result =  $this->service->syncEnrollment(
            $osce_id,
            $jadwal_id,
            $validated['id_mahasiswa_array']
        );

        $message = $result["message"];

        if ($result["success"] === true) {
            return redirect()->route('admin.osce.jadwal.index', $osce_id)->with('success', $message);
        } else if ($result["success" === false]) {
            return redirect()->back()->with('error', $message);
        }
    }
}
