<?php

namespace App\Http\Controllers\Penguji;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

use App\Models\EnrollmentOsce;
use App\Models\NilaiOsce;
use App\Models\OsceStase;

class EditNilaiController extends Controller
{
    public function edit(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        $enrollment = EnrollmentOsce::with(['mahasiswa', 'osce'])->findOrFail($id_enrollment_osce);

        if ($request->has('id_osce_stase')) {
            $osceStase = OsceStase::with(['stase', 'osce'])
                ->where('id_osce_stase', $request->query('id_osce_stase'))
                ->where('id_penguji', $user->penguji->id_penguji)
                ->firstOrFail();
        } else {
            $osceStase = OsceStase::with(['stase', 'osce'])
                ->where('id_osce', $enrollment->id_osce)
                ->where('id_penguji', $user->penguji->id_penguji)
                ->firstOrFail();
        }

        $rubrikStruktur = $osceStase->stase->load([
            'aspekPenilaian.poinAspekPenilaian.nilai_osce' => function ($query) use ($id_enrollment_osce) {
                $query->where('id_enrollment_osce', $id_enrollment_osce);
            }
        ]);

        $rubrikTerisi = $rubrikStruktur->aspekPenilaian->map(function ($aspek) {
             return [
                'aspek' => $aspek->aspek,
                'kompetensi' => $aspek->poinAspekPenilaian->map(function ($poin) {
                    $nilaiDb = $poin->nilai_osce; 
                    return [
                        'id_poin_aspek_penilaian' => $poin->id_poin_aspek_penilaian,
                        'deskripsi'     => $poin->kompetensi,
                        'bobot'         => $poin->bobot,
                        'skor_maksimal' => 4,
                        'skor'          => $nilaiDb ? (int)$nilaiDb->nilai : 0 
                    ];
                })
            ];
        });

        $osceDetail = [
            'id_osce'          => $osceStase->osce->id_osce,
            'id_osce_stase'    => $osceStase->id_osce_stase,
            'nama_osce'        => $osceStase->osce->nama,
            'nama_stase'       => $osceStase->stase->nama,
            'durasi_per_mahasiswa' => $osceStase->osce->durasi_per_mahasiswa ?? 15,
            'nama_penguji'     => $user->nama,
            'total_mahasiswa'  => EnrollmentOsce::where('id_osce', $enrollment->id_osce)->count(),
        ];

        return Inertia::render('Penguji/EditNilaiForm', [
            'mahasiswa'      => $enrollment->mahasiswa,
            'rubrik_terisi'  => $rubrikTerisi,
            'feedback_tersimpan' => $enrollment->catatan,
            'id_enrollment_osce' => $id_enrollment_osce,
            'osce_detail'    => $osceDetail, 
        ]);
    }

    public function update(Request $request, $id_enrollment_osce)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'nilai' => 'required|array',
            'nilai.*.id_poin_aspek_penilaian' => 'required|integer',
            'nilai.*.skor' => 'required|integer|min:0|max:4',
            'feedback' => 'nullable|string',
            'id_osce_stase' => 'required|integer|exists:osce_stase,id_osce_stase', 
        ]);

        $enrollment = EnrollmentOsce::findOrFail($id_enrollment_osce);

        DB::transaction(function () use ($validated, $id_enrollment_osce, $enrollment) {
            $enrollment->catatan = $validated['feedback'] ?? null;
            $enrollment->save();

            foreach ($validated['nilai'] as $item) {
                NilaiOsce::updateOrCreate(
                    [
                        'id_enrollment_osce' => $id_enrollment_osce,
                        'id_poin_aspek_penilaian' => $item['id_poin_aspek_penilaian'],
                    ],
                    [
                        'nilai' => $item['skor']
                    ]
                );
            }
        });

        return redirect()->route('penguji.Penilaian.submitrubrik', [
            'id_osce'       => $enrollment->id_osce,
            'id_osce_stase' => $request->id_osce_stase 
        ])->with('success', 'Nilai berhasil diperbarui.');
    }
}