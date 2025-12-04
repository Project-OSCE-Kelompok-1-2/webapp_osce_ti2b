<?php

namespace App\Services;

use App\Models\Osce;
use App\Models\Mahasiswa;
use App\Models\EnrollmentOsce;
use App\Models\OsceStase;
use Illuminate\Support\Facades\DB;

class OsceEnrollmentService
{
    /**
     * Ambil daftar mahasiswa + status enrollment untuk satu sesi OSCE.
     */
    public function getEnrollmentList($osce_id, $jadwal_id, $filters)
    {
        // Pastikan OSCE valid
        $osce = Osce::findOrFail($osce_id);

        // Ambil referensi sesi
        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
            ->where('id_osce_stase', $jadwal_id)
            ->firstOrFail();

        // Filters
        $search = $filters['search'] ?? null;
        $angkatan = $filters['angkatan'] ?? null;

        // Query mahasiswa
        $mahasiswa_query = Mahasiswa::query();

        if ($search) {
            $mahasiswa_query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        if ($angkatan) {
            $mahasiswa_query->where('kelas', $angkatan);
        }

        // Ambil ID mahasiswa yang sudah enroll untuk sesi ini
        $enrolled_ids = EnrollmentOsce::where('id_osce', $osce_id)
            ->where('tanggal_sesi', $sesi_ref->tanggal)
            ->where('jam_sesi', $sesi_ref->jam_mulai)
            ->pluck('id_mahasiswa')
            ->all();

        // Pagination
        $mahasiswa_list = $mahasiswa_query->orderBy('nama', 'asc')
            ->paginate(20)
            ->through(fn($mhs) => [
                'id_mahasiswa' => $mhs->id_mahasiswa,
                'nim' => $mhs->nim,
                'nama' => $mhs->nama,
                'is_enrolled' => in_array($mhs->id_mahasiswa, $enrolled_ids)
            ])
            ->withQueryString();

        return [
            'success' => true,
            'message' => 'Data enrollment berhasil diambil.',
            'data' => $mahasiswa_list
        ];
    }

    /**
     * Sinkronisasi enrollment mahasiswa untuk satu sesi OSC
     */
    public function syncEnrollment($osce_id, $jadwal_id, array $mahasiswa_ids)
    {
        // Ambil sesi
        $sesi_ref = OsceStase::select('tanggal', 'jam_mulai')
            ->where('id_osce_stase', $jadwal_id)
            ->firstOrFail();

        DB::beginTransaction();
        try {
            // Hapus enrollment lama pada sesi tersebut
            EnrollmentOsce::where('id_osce', $osce_id)
                ->where('tanggal_sesi', $sesi_ref->tanggal)
                ->where('jam_sesi', $sesi_ref->jam_mulai)
                ->delete();

            $now = now();
            $data_to_insert = [];

            foreach ($mahasiswa_ids as $id_mhs) {
                $data_to_insert[] = [
                    'id_osce'        => $osce_id,
                    'id_mahasiswa'   => $id_mhs,
                    'tanggal_sesi'   => $sesi_ref->tanggal,
                    'jam_sesi'       => $sesi_ref->jam_mulai,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }

            if (!empty($data_to_insert)) {
                EnrollmentOsce::insert($data_to_insert);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Enrollment berhasil disimpan.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Gagal menyimpan enrollment: ' . $e->getMessage(),
            ];
        }
    }
}
