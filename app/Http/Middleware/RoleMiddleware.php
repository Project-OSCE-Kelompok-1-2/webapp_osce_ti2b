<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!in_array($user->jenis_role, $roles)) {
            return $this->redirectByRole($user->jenis_role);
        }

        return $next($request);
    }

    private function redirectByRole($role)
    {
        return match ($role) {
            'admin' => redirect('/admin/dashboard'),
            'mahasiswa' => redirect('/mahasiswa/dashboard'),
            'penguji' => redirect('/penguji/dashboard'),
        };
    }
}
