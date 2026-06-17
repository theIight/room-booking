<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            ['name' => 'Meeting Room A', 'capacity' => 6],
            ['name' => 'Meeting Room B', 'capacity' => 10],
            ['name' => 'Focus Room', 'capacity' => 2],
            ['name' => 'Workshop Space', 'capacity' => 20],
        ])->each(fn (array $room) => Room::firstOrCreate(['name' => $room['name']], $room));
    }
}
