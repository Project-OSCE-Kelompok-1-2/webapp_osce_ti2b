<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService; 
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    /**
     * Login pengguna
     * @unauthenticated
     */
    
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $pengguna = $this->authService->verifyCredentials(
            $request->username,
            $request->password
        );

        if ($pengguna) {
            $token = $this->authService->generateApiToken($pengguna, 'mobile-app');

            return response()->json([
                'message' => 'Login berhasil',
                'user' => $pengguna, 
                'token' => $token,   
            ], 200);
        } else {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401); 
        }
    }

    /**
     * Logout pengguna
     */
    public function logout(Request $request)
    {
        $this->authService->revokeApiToken($request);

        return response()->json([
            'message' => 'Berhasil logout'
        ], 200);
    }
}
