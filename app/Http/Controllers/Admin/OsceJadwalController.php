<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Osce;
use Inertia\Inertia;
use App\Models\Ruang;
use App\Models\Stase;
use App\Models\Penguji;
use App\Models\Mahasiswa;
use App\Models\OsceStase;
use Illuminate\Http\Request;
use App\Models\TahunAkademik;
use App\Models\EnrollmentOsce;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class OsceJadwalController extends Controller
{
    /**
     * Menampilkan daftar Sesi (Jadwal) yang sudah di-grup
     */
    public function index(Request $request, $id_osce)
    {
        $osce = Osce::findOrFail($id_osce);
        $search = $request->query('search');

        $sesi_virtual_query = DB::table('osce_stase')
            ->where('id_osce', $id_osce)
            ->whereNotNull('tanggal')
            // [UBAH 1] Tambahkan jam_selesai di select
            ->select('tanggal', 'jam_mulai', 'jam_selesai', DB::raw('MIN(id_osce_stase) as id_osce_stase'))
            // [UBAH 2] Tambahkan jam_selesai di groupBy agar data konsisten
            ->groupBy('tanggal', 'jam_mulai', 'jam_selesai')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc');

        if ($search) {
            $sesi_virtual_query->where('tanggal', 'like', "%{$search}%");
        }

        $sesi_paginated = $sesi_virtual_query->paginate(10)->withQueryString();

        $sesi_data = $sesi_paginated->through(function ($sesi) use ($id_osce) {
            // 1. Hitung jumlah mahasiswa
            $sesi->jumlah_mahasiswa = EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $sesi->tanggal)
                ->where('jam_sesi', $sesi->jam_mulai)
                ->count();

            // 2. Ambil Data Ruangan
            $info_ruang = DB::table('osce_stase')
                ->join('ruang', 'osce_stase.id_ruang', '=', 'ruang.id_ruang')
                ->where('id_osce', $id_osce)
                ->where('tanggal', $sesi->tanggal)
                ->where('jam_mulai', $sesi->jam_mulai)
                ->select('ruang.nomor_ruangan', 'ruang.lokasi')
                ->first();

            if ($info_ruang) {
                $sesi->nama_ruang = $info_ruang->nomor_ruangan . ' - ' . $info_ruang->lokasi;
            } else {
                $sesi->nama_ruang = '-';
            }

            // 3. Formatting
            $sesi->tanggal_formatted = (new \DateTime($sesi->tanggal))->format('d M Y');
            $sesi->jam_mulai_formatted = substr($sesi->jam_mulai, 0, 5);
            // [UBAH 3] Format Jam Selesai
            $sesi->jam_selesai_formatted = substr($sesi->jam_selesai, 0, 5);

            return $sesi;
        });

        // ... sisa code return Inertia sama ...
        $master_stase = Stase::select('id_stase', 'nama_stase')->get()->map(fn($item) => [
            'value' => $item->id_stase,
            'label' => $item->nama_stase
        ]);

        return Inertia::render('Admin/OsceJadwalPage', [
            'osce' => $osce,
            'sesi' => $sesi_data,
            'filters' => ['search' => $search],
            'master_stase' => $master_stase,
        ]);
    }

    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'tanggal' => 'required|date',
                'jam_mulai' => 'required',
                'durasi' => 'required|numeric',
            ]);

            $start = Carbon::parse($request->jam_mulai);
            $end = $start->copy()->addMinutes((int)$request->durasi);

            $startStr = $start->format('H:i:s');
            $endStr = $end->format('H:i:s');

            $busyRuangIds = OsceStase::where('tanggal', $request->tanggal)
                ->where(function ($q) use ($startStr, $endStr) {
                    $q->where('jam_mulai', '<', $endStr)
                        ->where('jam_selesai', '>', $startStr);
                })
                ->pluck('id_ruang')
                ->toArray();

            $busyPengujiIds = OsceStase::where('tanggal', $request->tanggal)
                ->where(function ($q) use ($startStr, $endStr) {
                    $q->where('jam_mulai', '<', $endStr)
                        ->where('jam_selesai', '>', $startStr);
                })
                ->pluck('id_penguji')
                ->toArray();

            $availableRooms = Ruang::whereNotIn('id_ruang', $busyRuangIds)
                ->select('id_ruang', 'nomor_ruangan', 'lokasi')
                ->get()
                ->map(fn($r) => [
                    'value' => $r->id_ruang,
                    'label' => $r->nomor_ruangan . ' - ' . $r->lokasi
                ]);

            $availablePenguji = Penguji::whereNotIn('id_penguji', $busyPengujiIds)
                ->select('id_penguji', 'nama', 'nip')
                ->get()
                ->map(fn($p) => [
                    'value' => $p->id_penguji,
                    'label' => $p->nama . ($p->nip ? ' (NIP: ' . $p->nip . ')' : '')
                ]);

            return response()->json([
                'status' => 'success',
                'rooms' => $availableRooms,
                'penguji' => $availablePenguji,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API untuk mengambil data mahasiswa berdasarkan filter tahun akademik
     */
    public function getMahasiswa(Request $request)
    {
        // 1. Tangkap id_osce dari request frontend
        $id_osce = $request->id_osce;
        $tahun_filter = $request->angkatan;

        // 2. Ambil daftar ID mahasiswa yang SUDAH punya jadwal di OSCE ini
        $booked_ids = [];
        if ($id_osce) {
            $booked_ids = EnrollmentOsce::where('id_osce', $id_osce)
                ->pluck('id_mahasiswa')
                ->toArray();
        }

        $query = Mahasiswa::query()
            ->select('id_mahasiswa', 'nama', 'nim')
            ->orderBy('nim', 'asc');

        if ($tahun_filter) {
            $query->whereHas('enrollment.tahunAkademik', function ($q) use ($tahun_filter) {
                $q->where('tahun', $tahun_filter);
            });
        }

        // 3. Map data dan tambahkan flag 'already_enrolled'
        $mahasiswa = $query->get()->map(fn($m) => [
            'value' => $m->id_mahasiswa,
            'label' => "{$m->nim} - {$m->nama}",
            // True jika ID ada di daftar booked
            'already_enrolled' => in_array($m->id_mahasiswa, $booked_ids)
        ]);

        $list_angkatan = TahunAkademik::whereHas('enrollment')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        return response()->json([
            'mahasiswa' => $mahasiswa,
            'list_angkatan' => $list_angkatan
        ]);
    }

    /**
     * Menyimpan data Jadwal/Sesi baru BESERTA Enrollment Mahasiswa
     */
    public function store(Request $request, $id_osce)
    {
        // [TAMBAHAN 1] Ambil Data OSCE untuk cek rentang tanggal yang ada
        $osce = Osce::findOrFail($id_osce);

        // ... (Validasi input awal tetap sama) ...
        $validated = $request->validate([
            'tanggal'       => 'required|date',
            'jam_mulai'     => 'required',
            'durasi'        => 'required|numeric',
            'stase_ids'     => 'required|array|min:1',
            'id_ruang'      => 'required',
            'penguji_map'   => 'required|array',
            'mahasiswa_ids' => 'nullable|array',
            'mahasiswa_ids.*' => 'exists:mahasiswa,id_mahasiswa',
        ]);

        // [TAMBAHAN 2] Validasi Rentang Tanggal (Backend Logic)
        $inputDate = Carbon::parse($validated['tanggal'])->startOfDay();
        $startDate = Carbon::parse($osce->tanggal_mulai)->startOfDay();
        $endDate   = Carbon::parse($osce->tanggal_selesai)->endOfDay();

        if ($inputDate->lessThan($startDate) || $inputDate->greaterThan($endDate)) {
            return redirect()->back()
                ->with('error', 'Tanggal yang dipilih (' . $validated['tanggal'] . ') di luar periode pelaksanaan OSCE (' . $osce->tanggal_mulai . ' s.d ' . $osce->tanggal_selesai . ').')
                ->withInput();
        }

        // ... (Logika validasi jumlah stase vs mahasiswa tetap sama) ...
        $jumlah_stase = count($validated['stase_ids']);
        $jumlah_mahasiswa = count($validated['mahasiswa_ids'] ?? []);

        if ($jumlah_stase !== $jumlah_mahasiswa) {
            return redirect()->back()
                ->withErrors(['mahasiswa_ids' => "Jumlah mahasiswa ($jumlah_mahasiswa) harus sama dengan jumlah stase ($jumlah_stase)."])
                ->withInput();
        }

        // 2. Format Waktu (Tetap sama)
        $waktu_mulai = Carbon::parse($validated['jam_mulai']);
        $jam_fix = $waktu_mulai->format('H:i');
        $total_menit  = (int)$validated['durasi'] * $jumlah_stase;
        $waktu_selesai = $waktu_mulai->copy()->addMinutes($total_menit);

        DB::beginTransaction();
        try {
            // A. SIMPAN JADWAL STASE (Tetap sama)
            foreach ($validated['stase_ids'] as $staseId) {
                $pengujiId = $validated['penguji_map'][$staseId] ?? null;
                if ($pengujiId) {
                    $new = new OsceStase();
                    $new->id_osce = $id_osce;
                    $new->id_stase = $staseId;
                    $new->id_ruang = $validated['id_ruang'];
                    $new->id_penguji = $pengujiId;
                    $new->tanggal = $validated['tanggal'];
                    $new->jam_mulai = $jam_fix;
                    $new->jam_selesai = $waktu_selesai->format('H:i');
                    $new->durasi_per_mahasiswa = $validated['durasi'];
                    $new->save();
                }
            }

            // B. SIMPAN ENROLLMENT MAHASISWA (Tetap sama)
            if (!empty($validated['mahasiswa_ids'])) {
                foreach ($validated['mahasiswa_ids'] as $mhsId) {

                    // Cek apakah sudah ada di OSCE ini
                    $alreadyBooked = EnrollmentOsce::where('id_osce', $id_osce)
                        ->where('id_mahasiswa', $mhsId)
                        ->exists();

                    if ($alreadyBooked) {
                        DB::rollBack();
                        $mhsName = Mahasiswa::find($mhsId)->nama ?? 'Mahasiswa';
                        return redirect()->back()
                            ->withErrors(['mahasiswa_ids' => "Gagal: $mhsName sudah memiliki jadwal di ujian ini."])
                            ->withInput();
                    }

                    $enroll = new EnrollmentOsce();
                    $enroll->id_osce      = $id_osce;
                    $enroll->id_mahasiswa = $mhsId;
                    $enroll->tanggal_sesi = $validated['tanggal'];
                    $enroll->jam_sesi     = $jam_fix;
                    $enroll->save();
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Jadwal Sesi & Mahasiswa Berhasil Disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan: ' . $e->getMessage());
        }
    }

    public function getSessionDetail(Request $request, $id_osce)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required'
        ]);

        // 1. Ambil Data Stase, Penguji, dan Ruangan di sesi ini
        $stase_list = OsceStase::with(['stase', 'penguji', 'ruang'])
            ->where('id_osce', $id_osce)
            ->where('tanggal', $request->tanggal)
            ->where('jam_mulai', $request->jam_mulai)
            ->get()
            ->map(fn($item) => [
                'stase' => $item->stase->nama_stase,
                'penguji' => $item->penguji->nama ?? '-',
                'ruang' => $item->ruang->nomor_ruangan . ' (' . $item->ruang->lokasi . ')'
            ]);

        // 2. Ambil Data Mahasiswa yang terdaftar di sesi ini
        $mahasiswa_list = EnrollmentOsce::with('mahasiswa')
            ->where('id_osce', $id_osce)
            ->where('tanggal_sesi', $request->tanggal)
            ->where('jam_sesi', $request->jam_mulai)
            ->get()
            ->map(fn($item) => [
                'nama' => $item->mahasiswa->nama,
                'nim' => $item->mahasiswa->nim
            ]);

        return response()->json([
            'stase_data' => $stase_list,
            'mahasiswa_data' => $mahasiswa_list
        ]);
    }


    /**
     * Menampilkan form untuk membuat jadwal baru
     * GET /admin/osce/{id_osce}/jadwal/create
     */
    public function create($id_osce)
    {
        $osce = Osce::findOrFail($id_osce);

        // [PERBAIKAN] Ambil HANYA stase template (yang tanggalnya null)
        $stase_options = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal') // <-- INI KUNCINYA
            ->with(['stase', 'ruang', 'penguji'])
            ->get()
            ->map(fn($item) => [
                'value' => $item->id_osce_stase,
                'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
            ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'stase_options' => $stase_options,
            'sesi' => null,
            'stase_terpilih' => [],
        ]);
    }

    /**
     * Menampilkan form untuk EDIT jadwal sesi
     * GET /admin/osce/{id_osce}/jadwal/{sesi_id}/edit
     */
    public function edit($id_osce, $sesi_id)
    {
        $osce = Osce::findOrFail($id_osce);

        list($tanggal, $jam_mulai_full) = explode('_', $sesi_id);

        $sesi_data = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('tanggal', 'jam_mulai', 'jam_selesai')
            ->first();

        if (!$sesi_data) {
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('error', 'Sesi tidak ditemukan.');
        }

        $tanggal_formatted = (new \DateTime($sesi_data->tanggal))->format('Y-m-d');

        $sesi = (object)[
            'tanggal' => $tanggal_formatted,
            'jam_mulai' => substr($sesi_data->jam_mulai, 0, 5),
            'jam_selesai' => substr($sesi_data->jam_selesai, 0, 5),
            'jam_mulai_full' => $sesi_data->jam_mulai,
        ];

        // 1. [PERBAIKAN] Ambil HANYA stase template (tanggal null)
        // Ini akan menjadi daftar checklist
        $stase_options = OsceStase::where('id_osce', $id_osce)
            ->whereNull('tanggal') // <-- INI KUNCINYA
            ->with(['stase', 'ruang', 'penguji'])
            ->get();

        // 2. Ambil stase (salinan) yang ada di sesi ini
        $stase_in_session = OsceStase::where('id_osce', $id_osce)
            ->where('tanggal', $tanggal)
            ->where('jam_mulai', $jam_mulai_full)
            ->select('id_stase', 'id_penguji', 'id_ruang') // Pilih konfigurasinya
            ->get();

        // 3. Tentukan template mana yang harus diceklis
        $stase_terpilih_ids = [];

        foreach ($stase_options as $template) {
            // Cek apakah ada stase di sesi ini yang konfigurasinya
            // sama dengan template ini
            $is_selected = $stase_in_session->first(function ($session_instance) use ($template) {
                return $session_instance->id_stase === $template->id_stase &&
                    $session_instance->id_penguji === $template->id_penguji &&
                    $session_instance->id_ruang === $template->id_ruang;
            });

            if ($is_selected) {
                // Jika ya, tambahkan ID TEMPLATE ke daftar ceklis
                $stase_terpilih_ids[] = $template->id_osce_stase;
            }
        }

        // 4. Format opsi untuk React
        $stase_options_formatted = $stase_options->map(fn($item) => [
            'value' => $item->id_osce_stase,
            'label' => $item->stase->nama_stase . ' - ' . $item->ruang->nomor_ruangan . ' (Penguji: ' . $item->penguji->nama . ')'
        ]);

        return Inertia::render('Admin/TambahJadwalSesi', [
            'osce' => $osce,
            'sesi' => $sesi,
            'stase_options' => $stase_options_formatted,
            'stase_terpilih' => array_unique($stase_terpilih_ids), // Kirim ID template yg diceklis
        ]);
    }

    /**
     * Mengupdate jadwal sesi yang sudah ada
     * PUT /admin/osce/{id_osce}/jadwal/{sesi_id}
     */
    public function update(Request $request, $id_osce, $sesi_id)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'stase_ids' => 'required|array|min:1',
            'stase_ids.*' => 'required|exists:osce_stase,id_osce_stase',
        ]);

        list($old_tanggal, $old_jam_mulai) = explode('_', $sesi_id);

        DB::beginTransaction();
        try {
            // 1. HAPUS semua baris stase yang terikat pada sesi LAMA
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $old_tanggal)
                ->where('jam_mulai', $old_jam_mulai)
                ->delete(); // Ganti dari update() menjadi delete()

            // 2. BUAT BARU (Replicate) dari template stase yang dipilih
            foreach ($validated['stase_ids'] as $template_stase_id) {
                $template = OsceStase::find($template_stase_id);
                if ($template) {
                    $new_sesi_stase = $template->replicate();

                    // Terapkan jadwal BARU pada salinan
                    $new_sesi_stase->tanggal = $validated['tanggal'];
                    $new_sesi_stase->jam_mulai = $validated['jam_mulai'];
                    $new_sesi_stase->jam_selesai = $validated['jam_selesai'];

                    // Simpan salinan sebagai baris BARU
                    $new_sesi_stase->save();
                }
            }

            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui jadwal: ' . $e->getMessage());
        }
    }


    /**
     * Menghapus (me-reset) jadwal sesi
     * DELETE /admin/osce/{id_osce}/jadwal/{sesi_id}
     */
    public function destroy($id_osce, $sesi_id)
    {
        list($tanggal, $jam_mulai) = explode('_', $sesi_id);

        DB::beginTransaction();
        try {
            // 1. Hapus Stase
            OsceStase::where('id_osce', $id_osce)
                ->where('tanggal', $tanggal)
                ->where('jam_mulai', $jam_mulai)
                ->delete();

            // 2. [OPSIONAL] Hapus Mahasiswa dari sesi ini
            // Agar jumlah mahasiswa di dashboard update
            EnrollmentOsce::where('id_osce', $id_osce)
                ->where('tanggal_sesi', $tanggal)
                ->where('jam_sesi', $jam_mulai)
                ->delete();

            DB::commit();
            return redirect()->route('admin.osce.jadwal.index', $id_osce)
                ->with('success', 'Jadwal sesi dan enrollment mahasiswa berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }
}
