<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexRoomRequest;
use App\Http\Requests\RoomBookingsRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\UseCases\GetRoomsUseCase;
use Src\Application\UseCases\GetRoomBookingsUseCase;

class RoomController extends Controller
{
    public function index(IndexRoomRequest $request, GetRoomsUseCase $getRoomsUseCase): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return RoomResource::collection(
            $getRoomsUseCase->execute($validated['per_page'] ?? 10)
        );
    }

    public function bookings(RoomBookingsRequest $request, Room $room, GetRoomBookingsUseCase $getRoomBookingsUseCase): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return BookingResource::collection(
            $getRoomBookingsUseCase->execute($room, $validated)
        );
    }
}
