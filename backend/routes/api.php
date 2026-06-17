<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('auth/token', [AuthController::class, 'token'])->middleware('throttle:5,1');

    Route::get('rooms', [RoomController::class, 'index']);
    Route::get('rooms/{room}/bookings', [RoomController::class, 'bookings']);

    Route::post('bookings', [BookingController::class, 'store'])
        ->middleware([JwtMiddleware::class, 'throttle:10,1']);

    Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])
        ->middleware([JwtMiddleware::class, 'throttle:5,1']);
});
