<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiDocs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $pengguna = $request->user();
        if ($pengguna->username != "ifad") {
            return $this->redirectByRole($pengguna->jenis_role);
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
