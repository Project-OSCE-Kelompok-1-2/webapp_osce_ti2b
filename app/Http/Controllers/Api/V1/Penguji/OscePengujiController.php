<?php

namespace App\Http\Controllers\Api\V1\Penguji;

use App\Http\Controllers\Controller;
use App\Services\OscePengujiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OscePengujiController extends Controller
{
    protected $oscePengujiService;

    public function __construct(OscePengujiService $oscePengujiService)
    {
        $this->oscePengujiService = $oscePengujiService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $tahun  = $request->input('tahun');
        $user   = Auth::user();

        $osceList = $this->oscePengujiService->getAssignmentsForPenguji($user, $search, $tahun);

        return response()->json([
            'osce_list' => $osceList,
            'filters'   => [
                'search' => $search,
                'tahun'  => $tahun
            ]
        ]);
    }
}