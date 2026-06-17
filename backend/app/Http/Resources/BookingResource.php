<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_name' => $this->user_name,
            'start_time' => $this->start_time->utc()->toIso8601String(),
            'end_time' => $this->end_time->utc()->toIso8601String(),
        ];
    }
}
