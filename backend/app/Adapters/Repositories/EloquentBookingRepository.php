<?php

namespace App\Adapters\Repositories;

use App\Models\Booking as BookingModel;
use DateTimeImmutable;
use Src\Application\Ports\BookingRepositoryInterface;
use Src\Domain\Entities\Booking;

final class EloquentBookingRepository implements BookingRepositoryInterface
{
    public function hasOverlap(int $roomId, DateTimeImmutable $startTime, DateTimeImmutable $endTime): bool
    {
        return BookingModel::query()
            ->where('room_id', $roomId)
            ->where('start_time', '<', $endTime->format('Y-m-d H:i:s'))
            ->where('end_time', '>', $startTime->format('Y-m-d H:i:s'))
            ->exists();
    }

    public function create(Booking $booking): Booking
    {
        $model = BookingModel::query()->create([
            'room_id' => $booking->roomId,
            'user_name' => $booking->userName,
            'phone_number' => $booking->phoneNumber,
            'start_time' => $booking->startTime->format('Y-m-d H:i:s'),
            'end_time' => $booking->endTime->format('Y-m-d H:i:s'),
        ]);

        return $this->toEntity($model);
    }

    public function findById(int $id): ?Booking
    {
        $model = BookingModel::query()->find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function delete(int $id): void
    {
        BookingModel::query()->whereKey($id)->delete();
    }

    private function toEntity(BookingModel $model): Booking
    {
        return new Booking(
            id: $model->id,
            roomId: $model->room_id,
            userName: $model->user_name,
            phoneNumber: $model->phone_number,
            startTime: DateTimeImmutable::createFromInterface($model->start_time),
            endTime: DateTimeImmutable::createFromInterface($model->end_time),
        );
    }
}
