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
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        $allowedRoles = implode(', ', $roles); 

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Unauthenticated. Token tidak valid atau user tidak ditemukan."
            ], 401);
        }

        if (!in_array($user->jenis_role, $roles)) {
            return response()->json([
                "success" => false,
                "message" => "Akses Ditolak. Role Anda ('{$user->jenis_role}') tidak diizinkan. Role yang diizinkan: {$allowedRoles}"
            ], 403);
        }

        return $next($request);
    }
}
