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

        if (!$user) {
            // Belum login
            return redirect('/login');
        }

        if (!in_array($user->jenis_role, $roles)) {
            // Role tidak sesuai
            return back();
        }

        return $next($request);
    }
}
