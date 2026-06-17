<?php

namespace Src\Application\Ports;

use DateTimeImmutable;
use Src\Domain\Entities\Booking;

interface BookingRepositoryInterface
{
    public function hasOverlap(int $roomId, DateTimeImmutable $startTime, DateTimeImmutable $endTime): bool;

    public function create(Booking $booking): Booking;

    public function findById(int $id): ?Booking;

    public function delete(int $id): void;
}
