<?php

namespace App\Providers;

use App\Http\Controllers\ChatController;
use App\Interfaces\ChatInterface;
use App\Repositories\ChatRepository;
use Illuminate\Support\ServiceProvider;

class ChatServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
        $this->app->bind(ChatInterface::class, ChatRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
