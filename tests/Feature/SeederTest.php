<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function semua_seeder_dapat_dijalankan_tanpa_error()
    {
        $this->artisan('db:seed')->assertExitCode(0);
    }
}
