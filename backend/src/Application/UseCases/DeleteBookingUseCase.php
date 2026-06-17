<?php

namespace Src\Application\UseCases;

use DateTimeImmutable;
use Src\Application\Ports\BookingRepositoryInterface;
use Src\Application\Ports\HashServiceInterface;
use Src\Domain\Exceptions\BookingAlreadyStartedException;
use Src\Domain\Exceptions\BookingNotFoundException;
use Src\Domain\Exceptions\ForbiddenBookingDeletionException;

final readonly class DeleteBookingUseCase
{
    public function __construct(
        private BookingRepositoryInterface $bookings,
        private HashServiceInterface $hashService,
    ) {}

    public function execute(int $bookingId, string $jwtUsername, string $jwtPhoneNumber, ?DateTimeImmutable $now = null): void
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            throw new BookingNotFoundException();
        }

        $now ??= new DateTimeImmutable('now');

        if ($booking->startTime <= $now) {
            throw new BookingAlreadyStartedException();
        }

        if ($booking->userName !== $jwtUsername || ! $this->hashService->check($jwtPhoneNumber, $booking->phoneNumber)) {
            throw new ForbiddenBookingDeletionException();
        }

        $this->bookings->delete($bookingId);
    }
}
