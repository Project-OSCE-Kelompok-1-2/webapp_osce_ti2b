<?php

namespace App\Http\Controllers\Api\V1;

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

        return response()->json(
            $this->service->store($id_osce, $validated)
        );
    }

    public function update(Request $request, $id_osce, OsceStase $osce_stase)
    {
        $validated = $request->validate([
            "id_ruang" => "required|exists:ruang,id_ruang",
            "id_stase" => "required|exists:stase,id_stase",
            "id_penguji" => "required|exists:penguji,id_penguji",
        ]);

        return response()->json(
            $this->service->update($id_osce, $osce_stase, $validated)
        );
    }

    public function destroy($id_osce, $id_osce_stase)
    {
        return response()->json(
            $this->service->destroy($id_osce, $id_osce_stase)
        );
    }
}
