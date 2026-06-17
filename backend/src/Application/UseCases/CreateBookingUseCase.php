<?php

namespace Src\Application\UseCases;

use Src\Application\DTOs\CreateBookingDTO;
use Src\Application\Ports\BookingRepositoryInterface;
use Src\Application\Ports\HashServiceInterface;
use Src\Domain\Entities\Booking;
use Src\Domain\Exceptions\OverlapException;

final readonly class CreateBookingUseCase
{
    public function __construct(
        private BookingRepositoryInterface $bookings,
        private HashServiceInterface $hashService,
    ) {}

    public function execute(CreateBookingDTO $dto): Booking
    {
        if ($this->bookings->hasOverlap($dto->roomId, $dto->startTime, $dto->endTime)) {
            throw new OverlapException();
        }

        return $this->bookings->create(new Booking(
            id: null,
            roomId: $dto->roomId,
            userName: $dto->userName,
            phoneNumber: $this->hashService->make($dto->phoneNumber),
            startTime: $dto->startTime,
            endTime: $dto->endTime,
        ));
    }
}
