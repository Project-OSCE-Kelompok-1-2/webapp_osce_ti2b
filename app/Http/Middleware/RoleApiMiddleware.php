<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // RoleApiMiddleware.php (DIREKOMENDASIKAN)
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        $allowedRoles = implode(', ', $roles); // Agar pesan lebih rapi

        // 1. Cek apakah user ada (sudah terautentikasi)
        if (!$user) {
            // Jika sampai sini dan user null, berarti ada masalah serius atau
            // auth:sanctum gagal memuat user. Kembalikan Unauthorized.
            return response()->json([
                "success" => false,
                "message" => "Unauthenticated. Token tidak valid atau user tidak ditemukan."
            ], 401);
        }

        // 2. Cek apakah role user tidak sesuai
        if (!in_array($user->jenis_role, $roles)) {
            return response()->json([
                "success" => false,
                "message" => "Akses Ditolak. Role Anda ('{$user->jenis_role}') tidak diizinkan. Role yang diizinkan: {$allowedRoles}"
            ], 403);
        }

        return $next($request);
    }
}
