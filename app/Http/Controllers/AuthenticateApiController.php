<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use Dedoc\Scramble\Scramble;
use Illuminate\Http\Request;

class AuthenticateApiController extends Controller
{
    public function show_api_docs()
    {
        return view('scramble::docs', [
            'spec' => file_get_contents(base_path('api.json')),
            'config' => Scramble::getGeneratorConfig('default'),
        ]);
    }
}
