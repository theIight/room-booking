<?php

namespace Src\Application\UseCases;

use App\Models\Booking;
use App\Models\Room;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class GetRoomBookingsUseCase
{
    public function execute(Room $room, array $filters = []): LengthAwarePaginator
    {
        $query = Booking::query()
            ->where('room_id', $room->id)
            ->orderBy('start_time');

        if (isset($filters['from'])) {
            $query->where('end_time', '>=', CarbonImmutable::parse($filters['from'])->utc()->format('Y-m-d H:i:s'));
        }

        if (isset($filters['to'])) {
            $query->where('start_time', '<=', CarbonImmutable::parse($filters['to'])->utc()->format('Y-m-d H:i:s'));
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }
}
