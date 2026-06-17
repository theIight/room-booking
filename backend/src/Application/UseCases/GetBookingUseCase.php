<?php

namespace Src\Application\UseCases;

use App\Models\Booking;

final class GetBookingUseCase
{
    public function execute(int $id): Booking
    {
        return Booking::query()->findOrFail($id);
    }
}
