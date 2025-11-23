<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Osce;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\OsceService;

class OsceController extends Controller
{
    protected $service;

    public function __construct(OsceService $service)
    {
        $this->service = $service;
    }

    /**
     * Mengambil seluruh data OSCE
     */
    public function index(Request $request)
    {
        return response()->json(
            $this->service->getAll($request)
        );
    }

    /**
     * Membuat data OSCE
     */
    public function store(Request $request)
    {
        return response()->json(
            $this->service->store($request)
        );
    }

    /**
     * Memperbarui data OSCE
     */
    public function update(Request $request, Osce $osce)
    {
        return response()->json(
            $this->service->update($request, $osce)
        );
    }

    /**
     * Menghapus data OSCE 
     */
    public function destroy(Osce $osce)
    {
        return response()->json(
            $this->service->destroy($osce)
        );
    }
}
