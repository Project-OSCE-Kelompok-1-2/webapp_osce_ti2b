<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\OsceService;

class OsceController extends Controller
{
    protected $osceService;

    public function __construct(OsceService $osceService)
    {
        $this->osceService = $osceService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        // Ambil input filter dari request
        $filters = [
            'search' => $request->input('search'),
            'tahun'  => $request->input('tahun'),
        ];

        // Panggil service untuk mendapatkan data yang sudah dipaginasi dan ditransformasi
        $osceList = $this->osceService->getOsceList($user, $filters);

        // Kembalikan response JSON
        return response()->json([
            'success' => true,
            'message' => 'Data daftar OSCE berhasil diambil',
            'data'    => [
                'osce_list' => $osceList,
                'filters'   => $filters
            ]
        ]);
    }
}