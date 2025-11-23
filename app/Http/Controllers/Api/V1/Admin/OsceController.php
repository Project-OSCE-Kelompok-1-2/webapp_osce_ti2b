<?php

namespace App\Http\Controllers\Api\V1\Admin;


use App\Models\Osce;
use Illuminate\Http\Request;
use App\Services\OsceService;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


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
        $validator = Validator::make($request->all(), [
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id_tahun_akademik',
            'nama_osce' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        if ($validator->fails()) {
            return [
                "success" => false,
                "message" => $validator->errors()->first(),
                "data" => null
            ];
        }

        return response()->json(
            $this->service->store($validator)
        );
    }

    /**
     * Memperbarui data OSCE
     */
    public function update(Request $request, Osce $osce)
    {
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

        if ($validator->fails()) {
            return [
                "success" => false,
                "message" => $validator->errors()->first(),
                "data" => null
            ];
        }

        return response()->json(
            $this->service->update( $osce, $validator)
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
