<?php

namespace App\Providers;

use App\Adapters\Repositories\EloquentBookingRepository;
use App\Adapters\Security\LaravelHashService;
use Illuminate\Support\ServiceProvider;
use Src\Application\Ports\BookingRepositoryInterface;
use Src\Application\Ports\HashServiceInterface;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BookingRepositoryInterface::class, EloquentBookingRepository::class);
        $this->app->bind(HashServiceInterface::class, LaravelHashService::class);
    }

    public function boot(): void
    {
        //
    }
}
