<?php

namespace Src\Application\DTOs;

use DateTimeImmutable;

final readonly class CreateBookingDTO
{
    public function __construct(
        public int $roomId,
        public string $userName,
        public string $phoneNumber,
        public DateTimeImmutable $startTime,
        public DateTimeImmutable $endTime,
    ) {}
}
