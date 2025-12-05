<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\TahunAkademik;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $details = null;
        $fotoUrl = null;

        if ($user) {
            if ($user->jenis_role === "penguji") {
                $user->load("penguji");
                $details = $user->penguji;
            } else if ($user->jenis_role === "mahasiswa") {
                $user->load("mahasiswa");
                $details = $user->mahasiswa;
            }
        }

        $tahunAktif = TahunAkademik::where('status', 'Aktif')->first();

        return array_merge(parent::share($request), [
            // mengirimkan data user yang sedang login ke front end
            'auth' => [
                'user' => [
                    'id' => $user?->id,
                    'username' => $user?->username,
                    'name' => $details?->nama ?? $user?->username,
                    'foto' => $fotoUrl,
                    'jenis_role' => $user?->jenis_role,
                    // details berisi data dari admin / penguji / mahasiswa, tergantung role pengguna
                    'details' => $details,
                ]
            ],

            // untuk notifikasi error dan sukses yang digunakan di front end
            'flash_massage' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],

            // 3. DATA GLOBAL TAHUN AKADEMIK (UPDATED)
        // Format: "2024/2025 - Ganjil"
        'academic_year' => $tahunAktif 
            ? ($tahunAktif->tahun . ' - ' . $tahunAktif->semester) 
            : null,
        ]);
    }
}
