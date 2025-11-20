<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Models\OsceStase;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\OsceStaseService;

class OsceStaseController extends Controller
{
    protected $service;

    public function __construct(OsceStaseService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, $id_osce)
    {
        return response()->json(
            $this->service->getAll($id_osce, $request->query('search'))
        );
    }

    public function store(Request $request, $id_osce)
    {
        $validated = $request->validate([
            "id_ruang" => "required|exists:ruang,id_ruang",
            "id_stase" => "required|exists:stase,id_stase",
            "id_penguji" => "required|exists:penguji,id_penguji",
        ]);

        $result = $this->service->store($id_osce, $validated);

        // Gunakan status 201 Created
        return response()->json($result, 201);
    }

    public function update(Request $request, $id_osce, OsceStase $osce_stase)
    {
        $validated = $request->validate([
            "id_ruang" => "required|exists:ruang,id_ruang",
            "id_stase" => "required|exists:stase,id_stase",
            "id_penguji" => "required|exists:penguji,id_penguji",
        ]);

        $result = $this->service->update($id_osce, $osce_stase, $validated);

        return response()->json($result, 200);
    }

    public function destroy($id_osce, $id_osce_stase)
    {
        $result = $this->service->destroy($id_osce, $id_osce_stase);

        // Cek success flag dari service untuk menentukan status code
        $status = $result['success'] ? 200 : 500;

        return response()->json($result, $status);
    }
}
