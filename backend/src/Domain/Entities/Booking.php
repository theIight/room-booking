<?php

namespace Src\Domain\Entities;

use DateTimeImmutable;

final readonly class Booking
{
    public function __construct(
        public ?int $id,
        public int $roomId,
        public string $userName,
        public string $phoneNumber,
        public DateTimeImmutable $startTime,
        public DateTimeImmutable $endTime,
    ) {}
}
