<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use Src\Application\UseCases\GetBookingUseCase;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Src\Application\DTOs\CreateBookingDTO;
use Src\Application\UseCases\CreateBookingUseCase;
use Src\Application\UseCases\DeleteBookingUseCase;
use Src\Domain\Exceptions\BookingAlreadyStartedException;
use Src\Domain\Exceptions\BookingNotFoundException;
use Src\Domain\Exceptions\ForbiddenBookingDeletionException;
use Src\Domain\Exceptions\OverlapException;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request, CreateBookingUseCase $createBooking, GetBookingUseCase $getBooking): JsonResponse
    {
        try {
            $booking = $createBooking->execute(new CreateBookingDTO(
                roomId: (int) $request->validated('room_id'),
                userName: $request->attributes->get('jwt_username'),
                phoneNumber: $request->attributes->get('jwt_phone_number'),
                startTime: CarbonImmutable::parse($request->validated('start_time'))->utc()->toDateTimeImmutable(),
                endTime: CarbonImmutable::parse($request->validated('end_time'))->utc()->toDateTimeImmutable(),
            ));
        } catch (OverlapException $exception) {
            return response()->json([
                'message' => 'Dữ liệu đã gửi không hợp lệ.',
                'errors' => ['start_time' => [$exception->getMessage()]],
            ], 422);
        }

        $model = $getBooking->execute($booking->id);

        return (new BookingResource($model))->response()->setStatusCode(201);
    }

    public function destroy(Request $request, int $booking, DeleteBookingUseCase $deleteBooking): JsonResponse
    {
        try {
            $deleteBooking->execute(
                bookingId: $booking,
                jwtUsername: $request->attributes->get('jwt_username'),
                jwtPhoneNumber: $request->attributes->get('jwt_phone_number'),
            );
        } catch (BookingNotFoundException) {
            return response()->json(['message' => 'Không tìm thấy lịch đặt.'], 404);
        } catch (BookingAlreadyStartedException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (ForbiddenBookingDeletionException $exception) {
            return response()->json(['message' => $exception->getMessage()], 403);
        }

        return response()->json(null, 204);
    }
}
