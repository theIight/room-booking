<?php

namespace Tests\Feature;

use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_delete_own_booking(): void
    {
        $room = Room::query()->create(['name' => 'Meeting Room A', 'capacity' => 6]);

        $token = $this->postJson('/api/v1/auth/token', [
            'username' => 'Alice',
            'phone_number' => '0901234567',
        ])->assertOk()->json('token');

        $start = now('UTC')->addDay()->setTime(9, 0)->toIso8601String();
        $end = now('UTC')->addDay()->setTime(11, 0)->toIso8601String();

        $bookingId = $this->withToken($token)->postJson('/api/v1/bookings', [
            'room_id' => $room->id,
            'start_time' => $start,
            'end_time' => $end,
        ])->assertCreated()->assertJsonMissing(['phone_number'])->json('data.id');

        $this->withToken($token)->deleteJson("/api/v1/bookings/{$bookingId}")->assertNoContent();
    }

    public function test_overlapping_booking_is_rejected(): void
    {
        $room = Room::query()->create(['name' => 'Focus Room', 'capacity' => 2]);

        $token = $this->postJson('/api/v1/auth/token', [
            'username' => 'Alice',
            'phone_number' => '0901234567',
        ])->assertOk()->json('token');

        $this->withToken($token)->postJson('/api/v1/bookings', [
            'room_id' => $room->id,
            'start_time' => now('UTC')->addDay()->setTime(9, 0)->toIso8601String(),
            'end_time' => now('UTC')->addDay()->setTime(11, 0)->toIso8601String(),
        ])->assertCreated();

        $this->withToken($token)->postJson('/api/v1/bookings', [
            'room_id' => $room->id,
            'start_time' => now('UTC')->addDay()->setTime(10, 0)->toIso8601String(),
            'end_time' => now('UTC')->addDay()->setTime(12, 0)->toIso8601String(),
        ])->assertUnprocessable();
    }
}
