<?php

namespace Src\Application\UseCases;

use App\Models\Room;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class GetRoomsUseCase
{
    public function execute(int $perPage = 10): LengthAwarePaginator
    {
        return Room::query()->orderBy('id')->paginate($perPage);
    }
}
