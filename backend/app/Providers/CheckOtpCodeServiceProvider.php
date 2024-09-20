<?php

namespace App\Providers;

use App\Interfaces\CheckOtpCodeInterface;
use App\Repositories\CheckOtpCodeRepository;
use Illuminate\Support\ServiceProvider;

class CheckOtpCodeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
        $this->app->bind(CheckOtpCodeInterface::class, CheckOtpCodeRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
