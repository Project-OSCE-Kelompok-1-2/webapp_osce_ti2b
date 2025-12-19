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

<<<<<<< HEAD
=======
        // 1. Eager Load Relasi
        // Perlu meload relasi agar data seperti NIM/NIP tersedia di sidebar
>>>>>>> b41c37c8f87a9a540275efcbd59c0d6f27382438
        if ($user) {
            if ($user->jenis_role === "penguji") {
                $user->loadMissing("penguji");
                $details = $user->penguji;
            } else if ($user->jenis_role === "mahasiswa") {
                $user->loadMissing("mahasiswa");
                $details = $user->mahasiswa;
            } else if ($user->jenis_role === "dosen") {
                $user->loadMissing("dosen");
                $details = $user->dosen;
            } else if ($user->jenis_role === "admin") {
                $user->loadMissing("admin");
                $details = $user->admin;
            }
        }

        $tahunAktif = TahunAkademik::where('status', 'Aktif')->first();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email, 
                    'name' => $details?->nama ?? $user->username, 
                    'path_gambar' => $user->path_gambar, 
                    'jenis_role' => $user->jenis_role,
                    
                    'mahasiswa' => $user->relationLoaded('mahasiswa') ? $user->mahasiswa : null,
                    'penguji' => $user->relationLoaded('penguji') ? $user->penguji : null,
                    'dosen' => $user->relationLoaded('dosen') ? $user->dosen : null,
                    'admin' => $user->relationLoaded('admin') ? $user->admin : null,
                ] : null
            ],

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],

            'academic_year' => $tahunAktif 
                ? ($tahunAktif->tahun . ' - ' . $tahunAktif->semester) 
                : null,
        ]);
    }
}