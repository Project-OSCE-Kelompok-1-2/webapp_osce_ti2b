<?php

namespace App\Http\Controllers;

use App\Models\Osce;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class OsceController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Osce::query();

    
        if ($request->has('search') && $request->search !== '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        
        $osceList = $query->orderBy('tanggal_mulai', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/OsceListPage', [
            'osce' => $osceList,
            'filters' => $request->only(['search', 'tahun']),
        ]);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_tahun_akademik' => 'required|exists:tahun_akademik,id',
            'nama' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'keterangan' => 'nullable|string',
        ]);

        Osce::create($validated);

        return Redirect::route('admin.osce.index')
            ->with('success', 'Data OSCE berhasil dibuat.');
    }
}
