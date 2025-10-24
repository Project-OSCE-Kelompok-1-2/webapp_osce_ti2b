<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuestMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
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
